import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { opportunity, userProfile, messages } = body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy_gemini_key" || process.env.GEMINI_API_KEY === "dummy_key") {
      return NextResponse.json({
        reply: "This is a simulated AI response. Please add a GEMINI_API_KEY to enable the real AI Coach."
      });
    }

    const systemPrompt = `You are a personalized academic and career advisor for ScholarBridge. 
You are speaking to a student with the following profile:
- Name: ${userProfile?.name || "the student"}
- Degree/Major: ${userProfile?.educationLevel || "Not specified"} in ${userProfile?.fieldOfStudy || "Not specified"}
- Institute: ${userProfile?.institute || "Not specified"}
- Demographics/Needs: Gender: ${userProfile?.genderIdentity || "Not specified"}, Special: ${userProfile?.specialDemographics || "None"}, Financial: ${userProfile?.financialNeed || "None"}

They are asking for help applying to this specific opportunity:
- Title: ${opportunity?.title}
- Type: ${opportunity?.type}
- Description: ${opportunity?.description}

STRICT RULES:
1. DO NOT ask the student for their background, degree, or college. You already have this information above.
2. Use their profile details to immediately provide highly tailored, specific advice on how they can win this opportunity.
3. If they are missing a specific requirement, point it out gently. If they are a perfect match, tell them exactly what to highlight in their essay or resume.`;

    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent({
      contents: formattedMessages
    });

    const reply = result.response.text() || "I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to communicate with AI Coach" },
      { status: 500 }
    );
  }
}
