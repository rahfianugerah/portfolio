import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-6 py-20">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
        Restricted
      </p>
      <h1 className="font-bebas mt-4 text-2xl text-white">Sign In</h1>
      <p className="mt-4 text-sm leading-6 text-zinc-300">
        A sign-in link is sent by email. There is no password to enter, and only one
        address can sign in.
      </p>
      <LoginForm />
    </div>
  );
}
