// src/app/actions.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { DATA } from "@/data/resume";

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