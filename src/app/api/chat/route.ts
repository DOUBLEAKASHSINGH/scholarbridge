import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { opportunityContext, userProfile, messages } = body;

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy_key") {
      return NextResponse.json({ 
        reply: "This is a simulated AI response. Please add an OpenAI API key to enable the real AI Coach." 
      });
    }

    const systemPrompt = `
      You are an expert AI scholarship and career coach for ScholarBridge.
      You are acting as an encouraging academic advisor to help a student apply for the following opportunity:
      ${opportunityContext}
      
      The student's profile:
      ${userProfile}
      
      Your goal is to provide actionable advice, review essay ideas, and answer questions about this specific opportunity.
      Keep your answers concise, encouraging, and highly specific to the provided opportunity context.
    `;

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
    });

    const reply = response.choices[0].message.content || "I couldn't generate a response.";
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to communicate with AI Coach" },
      { status: 500 }
    );
  }
}
