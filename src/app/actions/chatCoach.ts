"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function chatWithCoach(
  opportunityContext: string,
  userProfile: string,
  messageHistory: { role: "user" | "assistant", content: string }[],
  newMessage: string
) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy_key" || process.env.GEMINI_API_KEY === "dummy_gemini_key") {
    return "This is a simulated AI response. Please add a GEMINI_API_KEY to enable the real AI Coach.";
  }

  try {
    const systemPrompt = `
      You are an expert AI scholarship and career coach for ScholarBridge.
      You are helping a student apply for the following opportunity:
      ${opportunityContext}
      
      The student's profile:
      ${userProfile}
      
      Your goal is to provide actionable advice, review essay ideas, and answer questions about this specific opportunity.
      Keep your answers concise, encouraging, and highly specific to the provided opportunity context.
    `;

    const formattedHistory = messageHistory.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const formattedMessages = [
      ...formattedHistory,
      { role: "user", parts: [{ text: newMessage }] }
    ];

    if (formattedMessages.length > 0) {
      formattedMessages[0].parts[0].text = systemPrompt + "\n\n" + formattedMessages[0].parts[0].text;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent({
      contents: formattedMessages
    });

    return result.response.text() || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat error:", error);
    return "Sorry, I encountered an error. Please try again later.";
  }
}
