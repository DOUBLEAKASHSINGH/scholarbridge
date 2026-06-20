"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function searchAndStructureOpportunities(query: string, filters: Record<string, string>) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY environment variable.");
    }

    const filterString = Object.entries(filters)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");

    const systemPrompt = `You are an expert scholarship and grant researcher and database engineer.
Your task is to generate highly realistic, accurate real-world opportunities based on the user's search query and filters.
Because you cannot browse the live internet directly, you must simulate the discovery of real-world or highly realistic synthetic opportunities that match the criteria perfectly.

You MUST return a JSON object containing an array of opportunities.
The JSON structure MUST exactly match this schema:
{
  "opportunities": [
    {
      "title": "Name of the opportunity",
      "type": "scholarship" | "internship" | "grant",
      "provider": "Name of the offering organization",
      "description": "Overview of what it provides",
      "fundingAmount": "Estimated fund amount or 'Full Tuition' / 'Paid'",
      "eligibilityObject": {
        "degreeLevel": ["High School", "Undergraduate", "Postgraduate", "PhD"],
        "targetCountries": ["List", "Of", "Eligible", "Countries", "or 'International'"],
        "incomeCeiling": "String if applicable, else omit"
      },
      "location": "Remote" | "On-site" | "International",
      "deadline": "YYYY-MM-DD",
      "sourceUrl": "https://simulated-link-to-apply.com"
    }
  ]
}

Ensure you return at least 4 to 6 high-quality results.`;

    const userPrompt = `Query: ${query}\nFilters: ${filterString}\nPlease fetch and structure the opportunities now.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    return parsed.opportunities || [];
  } catch (error: any) {
    console.error("AI Ingestion Error:", error);
    // Return mock data fallback if API fails or key is dummy
    return [
      {
        title: "Mock AI Engineering Scholarship (Fallback)",
        type: "scholarship",
        provider: "Tech Forward Foundation",
        description: "A simulated fallback opportunity because the AI call failed or used a dummy key.",
        fundingAmount: "$10,000",
        eligibilityObject: {
          degreeLevel: ["Undergraduate"],
          targetCountries: ["International"],
        },
        location: "Remote",
        deadline: "2026-12-31",
        sourceUrl: "https://example.com/apply"
      }
    ];
  }
}
