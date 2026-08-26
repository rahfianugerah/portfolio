import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * The one place identity is read.
 *
 * Every route fills the same shape, so changing the identity source later means changing
 * this file and nothing else — that is the "one swappable abstraction" auth.rules.md asks
 * for, and the reason no route ever touches a Supabase client directly to ask who is
 * calling.
 *
 * The subject is Supabase's user UUID, not the email address. An address changes; a person
 * who changes theirs would otherwise become a different person to every system keyed on it.
 */
export type Auth = {
  subject: string;
  email: string;
  groups: string[];
};

/**
 * A server-side Supabase client bound to the request's cookies.
 *
 * `@supabase/ssr` keeps the session in an HttpOnly cookie rather than in localStorage or
 * sessionStorage. That is not a preference: a token in web storage is readable by any XSS
 * on the page, and auth.rules.md forbids it outright.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              httpOnly: true,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            });
          } catch {
            // A Server Component cannot set a cookie. The middleware refreshes the
            // session instead, so this is expected and not an error worth surfacing.
          }
        },
        remove: (name: string, options: CookieOptions) => {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch {
            // Same as above.
          }
        },
      },
    }
  );
}

/** The single account permitted to sign in. Supplied by environment, never committed. */
function ownerEmail(): string | null {
  const value = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
  return value ? value : null;
}

/**
 * Whether an address is the owner.
 *
 * Checked on the server on every request, not only at sign-in. A magic link mailed to any
 * other address authenticates nobody, because possession of a valid Supabase session is
 * necessary here but not sufficient.
 */
export function isOwner(email: string | null | undefined): boolean {
  const owner = ownerEmail();
  if (!owner || !email) return false;
  return email.trim().toLowerCase() === owner;
}

/**
 * Identity for the current request, or null.
 *
 * Uses `getUser()` rather than `getSession()`: `getSession()` returns whatever the cookie
 * claims without verifying it against the auth server, so a forged cookie would satisfy
 * it. `getUser()` validates.
 */
export async function getAuth(): Promise<Auth | null> {
  if (!ownerEmail()) return null; // Unconfigured means closed, never open.

  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  if (!isOwner(data.user.email)) return null;

  return {
    subject: data.user.id,
    email: data.user.email,
    groups: ["owner"],
  };
}

/** Throws unless the caller is the owner. Use at the top of every non-public route. */
export async function requireOwner(): Promise<Auth> {
  const auth = await getAuth();
  if (!auth) throw new Error("UNAUTHORIZED");
  return auth;
}
