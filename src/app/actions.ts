// src/app/actions.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { DATA } from "@/data/resume";
import nodemailer from "nodemailer";
import { z } from "zod";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";

// Contact form validation schema
const contactSchema = z.object({
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
  honeypot: z.string().optional(),
  captchaToken: z.string().optional(),
});

export async function generateChatResponse(history: any[], currentMessage: string) {
  // This reads the secure key from Vercel/Local .env
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return { error: "Server Error: API Key missing." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const systemPrompt = `
      You are a helpful AI assistant for Rahfi's personal portfolio website.
      Your goal is to answer questions about Rahfi based STRICTLY on the data provided below.
      
      If the user asks about something not in this data, simply say you don't know or ask them to email him.
      Be concise, professional, and friendly.

      Here is the Resume Data:
      ${JSON.stringify(DATA)}
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(currentMessage);
    const response = result.response.text();
    
    return { success: response };

  } catch (error) {
    console.error("AI Error:", error);
    return { error: "Failed to generate response." };
  }
}

// Submit contact form
export async function submitContactForm(formData: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
  captchaToken?: string;
}) {
  try {
    // 1. Honeypot check (catches simple bots)
    if (formData.honeypot) {
      console.log("Honeypot triggered - bot detected");
      return { error: "Invalid submission" };
    }

    // 2. Verify reCAPTCHA token (catches sophisticated bots)
    if (formData.captchaToken) {
      const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
      
      if (recaptchaSecret) {
        try {
          const captchaResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `secret=${recaptchaSecret}&response=${formData.captchaToken}`,
            }
          );

          const captchaData = await captchaResponse.json();
          
          if (!captchaData.success || (captchaData.score && captchaData.score < 0.5)) {
            console.log("reCAPTCHA failed:", captchaData);
            return { error: "Bot detection failed. Please try again." };
          }
        } catch (error) {
          console.error("reCAPTCHA verification error:", error);
          // Continue anyway if reCAPTCHA service is down
        }
      }
    }

    // Get client IP for rate limiting
    const headersList = headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "anonymous";

    // Rate limit check: 3 submissions per hour per IP
    const rateLimit = await checkRateLimit(ip, 3, 60 * 60 * 1000);
    
    if (!rateLimit.success) {
      const resetDate = new Date(rateLimit.resetTime);
      return {
        error: `Too many submissions. Please try again after ${resetDate.toLocaleTimeString()}.`,
      };
    }

    // Validate form data
    const validation = contactSchema.safeParse(formData);
    
    if (!validation.success) {
      return {
        error: validation.error.issues[0].message,
      };
    }

    const { fullName, email, subject, message } = validation.data;

    // Get environment variables
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables");
      return {
        error: "Server configuration error. Please try again later.",
      };
    }

    // Create Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `Portfolio Contact Form <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #FF0000; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;">
              <strong>From:</strong> ${fullName}
            </p>
            <p style="margin: 10px 0;">
              <strong>Email:</strong> 
              <a href="mailto:${email}" style="color: #0066cc;">${email}</a>
            </p>
            <p style="margin: 10px 0;">
              <strong>Subject:</strong> ${subject}
            </p>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #555;">
              ${message}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px;">
            <p>Submitted from your portfolio contact form</p>
            <p>IP: ${ip}</p>
            <p>Time: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    });

    return {
      success: "Message sent successfully! I'll get back to you soon.",
      remaining: rateLimit.remaining,
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}