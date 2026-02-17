"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReactNode } from "react";

export default function ReCaptchaWrapper({ children }: { children: ReactNode }) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // If no reCAPTCHA key is provided, render without protection (still has honeypot + rate limit)
  if (!recaptchaSiteKey) {
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
