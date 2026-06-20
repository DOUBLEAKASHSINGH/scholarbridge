"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key",
});

export async function chatWithCoach(
  opportunityContext: string,
  userProfile: string,
  messageHistory: { role: "user" | "assistant", content: string }[],
  newMessage: string
) {
  if (!process.env.OPENAI_API_KEY) {
    return "This is a simulated AI response. Please add an OpenAI API key to enable the real AI Coach.";
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

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      ...messageHistory,
      { role: "user", content: newMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });

    return response.choices[0].message.content || "I couldn't generate a response.";
  } catch (error) {
    console.error("OpenAI Chat error:", error);
    return "Sorry, I encountered an error. Please try again later.";
  }
}
