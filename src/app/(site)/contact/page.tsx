import BlurFade from "@/components/magicui/blur-fade";
import { Meteors } from "@/components/magicui/meteors";
import { getPageMeta } from "@/lib/content";
import ContactForm from "@/app/components/contact-form";
import HirePlatforms from "@/app/components/hire-platforms";
import ReCaptchaWrapper from "@/app/components/recaptcha-wrapper";

const BLUR_FADE_DELAY = 0.04;

export async function generateMetadata() {
  const meta = await getPageMeta("/contact");
  return {
    title: meta?.title ?? "Contact Me",
    description: meta?.description ?? "Get in touch for collaborations, opportunities, or just to say hello.",
  };
}

export default function ContactPage() {
  return (
    <section id="contact" className="flex w-full flex-col gap-12 pb-12">
      {/* The heading band runs to both edges and up under the top bar, with meteors behind it. */}
      <div className="relative isolate -mx-4 -mt-24 overflow-hidden px-4 pb-8 pt-32 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Meteors number={20} />
        </div>
        <BlurFade delay={BLUR_FADE_DELAY * 0.5}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Rahfi&apos;s | Contact.</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have a project in mind or want to collaborate? Feel free to reach out
                through the contact form below or connect with me on various professional platforms.
              </p>
            </div>
          </div>
        </BlurFade>
      </div>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <ReCaptchaWrapper siteKey={process.env.RECAPTCHA_SITE_KEY}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Column - Contact Form */}
            <div className="w-full h-full">
              <ContactForm />
            </div>

            {/* Right Column - Hire Platforms */}
            <div className="w-full h-full">
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
    </section>
  );
}
