import BlurFade from "@/components/magicui/blur-fade";
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
    <section id="contact">
      <div className="space-y-12 w-full py-12">
        <BlurFade delay={BLUR_FADE_DELAY * 0.5}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bebas">
                Rahfi&apos;s<span className="text-[#FF0000]"> | </span>Contact<span className="text-[#FF0000]">.</span>
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have a project in mind or want to collaborate? Feel free to reach out 
                through the contact form below or connect with me on various professional platforms.
              </p>
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <ReCaptchaWrapper>
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
      </div>

      <footer className="mt-12 text-center text-sm font-bebas text-muted-foreground pb-24 lg:pb-6">
        <p>© 2025 Naufal Rahfi Anugerah | All rights reserved.</p>
      </footer>
    </section>
  );
}
