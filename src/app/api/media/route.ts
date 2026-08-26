import { NextResponse } from "next/server";
import { createClient, requireOwner } from "@/lib/auth";
import { putObject, deleteObject, publicUrl } from "@/lib/gcs";
import {
  processUpload,
  storagePath,
  UploadError,
  MAX_UPLOAD_BYTES,
} from "@/lib/media";

// Uploads decode images, which is real work on a real buffer. Not an edge route.
export const runtime = "nodejs";

/** List the library. Owner only — the middleware does not cover /api. */
export async function GET() {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("media list failed:", error.message);
    return NextResponse.json({ error: "Could not list media" }, { status: 500 });
  }

  return NextResponse.json({
    items: (data ?? []).map((row: any) => ({
      ...row,
      // A link already carries its destination; a public file gets its CDN URL; a private
      // file gets nothing here and is reached through a signed URL on request.
      url:
        row.kind === "link"
          ? row.external_url
          : row.visibility === "public"
            ? publicUrl(row.storage_path)
            : null,
    })),
  });
}

/**
 * Upload a file.
 *
 * Order is deliberate: identity first, then size, then content type by magic bytes, and
 * only then does anything decode the file. A hostile upload is refused before it reaches
 * an image decoder, which is the component most worth keeping untrusted input away from.
 */
export async function POST(request: Request) {
  let auth;
  try {
    auth = await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const visibility = form.get("visibility") === "private" ? "private" : "public";
    const slug = (form.get("slug") as string | null)?.trim() || null;
    const altText = (form.get("alt") as string | null)?.trim() || null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file supplied" }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File exceeds the ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB limit` },
        { status: 413 }
      );
    }

    const input = Buffer.from(await file.arrayBuffer());
    const processed = await processUpload(input, file.name);
    const path = storagePath(visibility, processed.sha256, processed.extension);

    const supabase = createClient();

    // Deduplicate by content. The same bytes uploaded twice are stored once; the existing
    // row is returned rather than a second object written.
    const { data: existing } = await supabase
      .from("media")
      .select("*")
      .eq("sha256", processed.sha256)
      .eq("visibility", visibility)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        item: {
          ...existing,
          url: visibility === "public" ? publicUrl(existing.storage_path) : null,
        },
        deduplicated: true,
      });
    }

    await putObject(path, processed.buffer, processed.mimeType, visibility === "public");

    // A slug is unique, so re-uploading the resume replaces the row that owns the slug
    // and its URL never changes. The previous object is removed after the row is updated,
    // never before: a failed write must not leave the site pointing at nothing.
    let previousPath: string | null = null;
    if (slug) {
      const { data: prior } = await supabase
        .from("media")
        .select("storage_path")
        .eq("slug", slug)
        .maybeSingle();
      previousPath = prior?.storage_path ?? null;
      if (previousPath) {
        await supabase.from("media").delete().eq("slug", slug);
      }
    }

    const { data: inserted, error } = await supabase
      .from("media")
      .insert({
        storage_path: path,
        visibility,
        slug,
        original_filename: file.name,
        mime_type: processed.mimeType,
        original_bytes: processed.originalBytes,
        stored_bytes: processed.storedBytes,
        sha256: processed.sha256,
        width: processed.width,
        height: processed.height,
        alt_text: altText,
        uploaded_by: auth.subject,
      })
      .select()
      .single();

    if (error) {
      await deleteObject(path); // Do not leave an orphan object behind a failed insert.
      console.error("media insert failed:", error.message);
      return NextResponse.json({ error: "Could not record the upload" }, { status: 500 });
    }

    if (previousPath && previousPath !== path) {
      await deleteObject(previousPath);
    }

    return NextResponse.json({
      item: {
        ...inserted,
        url: visibility === "public" ? publicUrl(path) : null,
      },
    });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    // The message may name a bucket or a path; log it, return nothing specific.
    console.error("upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

/** Delete one item, object and row. */
export async function DELETE(request: Request) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No id supplied" }, { status: 400 });

  const supabase = createClient();
  const { data: row } = await supabase
    .from("media")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) {
    console.error("media delete failed:", error.message);
    return NextResponse.json({ error: "Could not delete" }, { status: 500 });
  }

  await deleteObject(row.storage_path);
  return NextResponse.json({ ok: true });
}
