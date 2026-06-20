"use server";

import OpenAI from "openai";
import { Opportunity } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key",
});

export async function generateMatches(
  userProfile: { educationLevel?: string; financialNeed?: string; role: string },
  opportunities: Opportunity[]
) {
  if (!process.env.OPENAI_API_KEY) {
    // Return dummy data if no key is provided, for testing UI
    return opportunities.map((opp) => ({
      opportunityId: opp.id,
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      reason: "This is a great match based on your profile.",
    })).sort((a, b) => b.score - a.score);
  }

  try {
    const prompt = `
      You are an expert scholarship advisor. I have a student with the following profile:
      Education Level: ${userProfile.educationLevel || "Not specified"}
      Financial Need: ${userProfile.financialNeed || "Not specified"}
      
      Here is a list of available opportunities (JSON):
      ${JSON.stringify(opportunities.map(o => ({ id: o.id, title: o.title, type: o.type, eligibility: o.eligibility }))) }
      
      Return a JSON object with a "matches" array, scoring each opportunity from 0 to 100 on how well it fits the student.
      Format: { "matches": [{ "opportunityId": "id", "score": 95, "reason": "short explanation" }] }
      Return ONLY valid JSON.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // we can wrap it in { matches: [...] } to ensure it
    });

    // To handle json_object reliably, we should ask for a JSON object containing an array.
    // Let's refine the prompt and parse.
    const responseContent = response.choices[0].message.content || '{"matches": []}';
    let parsed;
    try {
      parsed = JSON.parse(responseContent);
      return parsed.matches || parsed;
    } catch (e) {
      console.error("Failed to parse OpenAI response", e);
      return [];
    }
    
  } catch (error) {
    console.error("OpenAI API error:", error);
    return [];
  }
}
