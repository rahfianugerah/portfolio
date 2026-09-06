import { getAuth } from "@/lib/auth";
import { SeedContentButton } from "./seed-content-button";

export const metadata = {
  title: "Content",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // The middleware already redirected anyone who is not the owner. This is the second
  // lock: a page that can render without a session is a page that will, the first time a
  // matcher is edited carelessly.
  const auth = await getAuth();
  if (!auth) return null;

  return (
    <div className="px-6 py-16 sm:px-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
        Signed in as {auth.email}
      </p>
      <h1 className="font-bebas mt-4 text-2xl text-white sm:text-3xl">
        Content
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
        Every image, document and post lives in Sanity and is edited at{" "}
        <a className="underline underline-offset-4" href="/studio">/studio</a>. This page
        holds the one thing the studio cannot do for itself.
      </p>
      <SeedContentButton />
    </div>
  );
}
