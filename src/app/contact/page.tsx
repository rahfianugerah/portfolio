import BlurFade from "@/components/magicui/blur-fade";
import { PageHeader } from "@/components/page-header";
import ContactForm from "@/app/components/contact-form";
import HirePlatforms from "@/app/components/hire-platforms";
import ReCaptchaWrapper from "@/app/components/recaptcha-wrapper";

const BLUR_FADE_DELAY = 0.04;

export const metadata = {
  title: "Contact Me",
  description: "Get in touch for collaborations, opportunities, or just to say hello.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in Touch"
        subtitle="A project in mind, a role to discuss, or just a question. The form reaches me directly, and the platforms below work too."
      />

      <div className="border-b border-border px-6 py-16 sm:px-10 sm:py-20">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <ReCaptchaWrapper>
            <div className="grid border-l border-t border-border lg:grid-cols-2">
              {/* Left Column - Contact Form */}
              <div className="w-full border-b border-r border-border p-8">
                <ContactForm />
              </div>

              {/* Right Column - Hire Platforms */}
              <div className="w-full border-b border-r border-border p-8">
                <HirePlatforms />
              </div>
            </div>

            {/* reCAPTCHA branding (required when hiding the floating badge) */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </ReCaptchaWrapper>
        </BlurFade>
      </div>

    </>
  );
}
