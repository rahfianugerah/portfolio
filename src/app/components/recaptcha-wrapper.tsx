"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReactNode } from "react";

/**
 * The contact page reads the site key from the backend on the server and passes it in. It still
 * reaches the browser, because Google's script needs it there, but no variable here holds it.
 */
export default function ReCaptchaWrapper({
  siteKey,
  children,
}: {
  siteKey?: string;
  children: ReactNode;
}) {
  // If no reCAPTCHA key is provided, render without protection (still has honeypot + rate limit)
  if (!siteKey) {
    return <>{children}</>;
  }

  return <GoogleReCaptchaProvider reCaptchaKey={siteKey}>{children}</GoogleReCaptchaProvider>;
}
