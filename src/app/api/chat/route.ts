import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { opportunityContext, userProfile, messages } = body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy_gemini_key" || process.env.GEMINI_API_KEY === "dummy_key") {
      return NextResponse.json({ 
        reply: "This is a simulated AI response. Please add a GEMINI_API_KEY to enable the real AI Coach." 
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

    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent({
      contents: formattedMessages
    });

    const reply = result.response.text() || "I couldn't generate a response.";
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to communicate with AI Coach" },
      { status: 500 }
    );
  }
}
