import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { signedUrl } from "@/lib/gcs";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export const runtime = "nodejs";

/**
 * Redirects to a short-lived signed URL for the current resume.
 *
 * Public on purpose: a visitor must be able to download the CV. That makes this the one
 * unauthenticated route that can cause repeated work, so it is rate limited by IP.
 *
 * The resume is personal data, holding a name, contact details and an employment history, which is
 * why the object is private and this route mints a minutes-long URL rather than the file
 * living at a public path where it would be indexed and archived.
 */
export async function GET() {
  const forwarded = headers().get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  const limit = await checkRateLimit(`resume:${ip}`, 20, 60 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  // The anon client, deliberately: this route needs no elevated access, and the media
  // policy exposes no private row to it. The lookup is by slug on the server, so the
  // path is never disclosed to the browser.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("media")
    .select("storage_path")
    .eq("slug", "resume")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "No resume is published." }, { status: 404 });
  }

  try {
    const url = await signedUrl(data.storage_path, 10);
    // 302, and explicitly uncached: the target expires, so a cached redirect would send a
    // later visitor to a dead URL.
    return NextResponse.redirect(url, {
      status: 302,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("resume signing failed:", err);
    return NextResponse.json({ error: "Could not sign the file." }, { status: 500 });
  }
}
