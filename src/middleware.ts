import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Guards every CMS surface and refreshes the session cookie.
 *
 * Two jobs, and the second is the reason this file has to exist rather than the check
 * living only in each route: a Server Component cannot write a cookie, so without a
 * middleware pass the refreshed session would never be persisted and the owner would be
 * signed out whenever the access token expired.
 *
 * The guard is deny-by-default. It matches the CMS paths and lets exactly one through —
 * the login page — rather than listing what to protect, because a list of protected paths
 * is a list somebody forgets to add the next route to.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({
            name,
            value,
            ...options,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        },
        remove: (name: string, options: CookieOptions) => {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  // getUser, not getSession: getSession trusts whatever the cookie claims without
  // verifying it upstream, so a forged cookie would satisfy it. getUser validates.
  const { data } = await supabase.auth.getUser();

  const owner = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
  const email = data.user?.email?.trim().toLowerCase();
  const isOwner = Boolean(owner && email && owner === email);

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!isOwner && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Someone already signed in has no use for the login page.
  if (isOwner && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Only the CMS. The public site is untouched, so no visitor request pays for an auth
  // round trip. The API routes under /api/media check identity themselves as well —
  // middleware is a gate, not the only lock.
  matcher: ["/admin/:path*"],
};
