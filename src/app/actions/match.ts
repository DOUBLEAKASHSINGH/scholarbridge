"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Opportunity } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function generateMatches(
  userProfile: { 
    educationLevel?: string; 
    financialNeed?: string; 
    fieldOfStudy?: string; 
    countryOfResidence?: string; 
  },
  opportunities: Opportunity[]
) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy_key" || process.env.GEMINI_API_KEY === "dummy_gemini_key") {
    // Return dummy data if no key is provided
    return opportunities.slice(0, 5).map((opp) => ({
      opportunityId: opp.id,
      matchReason: "This is a great match based on your educational background and field of study.",
    }));
  }

  try {
    const prompt = `
      You are an expert scholarship and internship matching system for ScholarBridge.
      I have a student with the following profile:
      Education Level: ${userProfile.educationLevel || "Not specified"}
      Field of Study: ${userProfile.fieldOfStudy || "Not specified"}
      Country of Residence: ${userProfile.countryOfResidence || "Not specified"}
      Financial Need: ${userProfile.financialNeed || "Not specified"}
      
      Here is a list of active opportunities (JSON):
      ${JSON.stringify(opportunities.map(o => ({ 
        id: o.id, 
        title: o.title, 
        type: o.type, 
        eligibility: o.eligibility,
        targetCountry: o.targetCountry 
      })))}
      
      Evaluate the student's profile against these opportunities and pick the top 5 matches.
      Return a JSON object with a "matches" array containing exactly those 5 matches.
      Format: { "matches": [{ "opportunityId": "id", "matchReason": "brief explanation why this is a good fit" }] }
      Return ONLY valid JSON.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const responseContent = result.response.text() || '{"matches": []}';
    let parsed;
    try {
      parsed = JSON.parse(responseContent);
      return parsed.matches || [];
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return [];
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return [];
  }
}
