import { getAuth } from "@/lib/auth";
import { MediaManager } from "./media-manager";

export const metadata = {
  title: "Media Library",
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
        Media Library
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
        Images are stored publicly and served from the CDN. Documents are private and
        reachable only through a short-lived link. Uploading with the slug{" "}
        <code className="text-white">resume</code> replaces the CV in place, so its
        download URL never changes.
      </p>
      <MediaManager />
    </div>
  );
}
