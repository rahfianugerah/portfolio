"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitContactForm } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// Client-side validation schema
const formSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Get reCAPTCHA token
      let captchaToken: string | undefined;
      if (executeRecaptcha) {
        try {
          captchaToken = await executeRecaptcha("contact_form_submit");
        } catch (error) {
          console.error("reCAPTCHA execution failed:", error);
        }
      }

      // Submit form with honeypot and captcha token
      const result = await submitContactForm({
        ...data,
        honeypot,
        captchaToken,
      });

      if (result.error) {
        setSubmitMessage({
          type: "error",
          text: result.error,
        });
      } else if (result.success) {
        setSubmitMessage({
          type: "success",
          text: result.success,
        });
        form.reset();
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bebas text-foreground mb-2">
          Get In Touch
        </h2>
        <p className="text-sm text-muted-foreground">
          Fill out the form below and I&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex-1 flex flex-col">
          {/* Honeypot field - hidden from humans, bots will fill it */}
          <input
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1px",
              height: "1px",
            }}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            aria-hidden="true"
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Project Inquiry"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col">
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell me about your project or inquiry..."
                    className="flex-1 min-h-[120px] resize-none"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {submitMessage && (
            <div
              className={`p-4 rounded-lg text-sm ${
                submitMessage.type === "success"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
