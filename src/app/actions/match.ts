"use server";

import OpenAI from "openai";
import { Opportunity } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key",
});

export async function generateMatches(
  userProfile: { 
    educationLevel?: string; 
    financialNeed?: string; 
    fieldOfStudy?: string; 
    countryOfResidence?: string; 
  },
  opportunities: Opportunity[]
) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy_key") {
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const responseContent = response.choices[0].message.content || '{"matches": []}';
    let parsed;
    try {
      parsed = JSON.parse(responseContent);
      return parsed.matches || [];
    } catch (e) {
      console.error("Failed to parse OpenAI response", e);
      return [];
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    return [];
  }
}
