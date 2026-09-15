"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReactNode } from "react";

/**
 * The contact page reads the site key on the server and passes it in. It still reaches the
 * browser, because Google's script needs it there, but it is no longer a NEXT_PUBLIC_ variable
 * compiled into every bundle.
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
