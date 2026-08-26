import { NextResponse } from "next/server";
import { createClient, requireOwner } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Record a link.
 *
 * A link points at a document that lives somewhere else — a credential, a paper, a drive
 * folder — so there is nothing to upload and nothing to store. It shares the media table
 * with files because the two are listed, filtered and ordered together.
 */
export async function POST(request: Request) {
  let auth;
  try {
    auth = await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const title = (form.get("title") as string | null)?.trim();
  const rawUrl = (form.get("url") as string | null)?.trim();
  const category = (form.get("category") as string | null)?.trim() || null;
  const slug = (form.get("slug") as string | null)?.trim() || null;

  if (!title) return NextResponse.json({ error: "A title is required" }, { status: 400 });
  if (!rawUrl) return NextResponse.json({ error: "A URL is required" }, { status: 400 });

  // Parse before storing, and accept only http(s).
  //
  // A `javascript:` or `data:` URL rendered into an href is a stored cross-site scripting
  // hole: it executes in the visitor's session the moment somebody clicks it. React
  // escapes text, not URL schemes, so this check is the control — there is nothing
  // downstream that would catch it.
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "That is not a valid URL" }, { status: 400 });
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return NextResponse.json(
      { error: "Only http and https links are accepted." },
      { status: 400 }
    );
  }

  const supabase = createClient();

  // A slug is unique and identifies a thing rather than a copy of it, so re-saving the
  // same slug replaces what is there instead of accumulating duplicates.
  if (slug) {
    await supabase.from("media").delete().eq("slug", slug);
  }

  const { data, error } = await supabase
    .from("media")
    .insert({
      kind: "link",
      visibility: "public",
      title,
      external_url: url.toString(),
      category,
      slug,
      uploaded_by: auth.subject,
    })
    .select()
    .single();

  if (error) {
    console.error("link insert failed:", error.message);
    return NextResponse.json({ error: "Could not save the link" }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}
