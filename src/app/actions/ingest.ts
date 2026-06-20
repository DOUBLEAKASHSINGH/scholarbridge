"use server";

import OpenAI from "openai";
import { tavily } from "@tavily/core";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function searchAndStructureOpportunities(query: string, filters: Record<string, string>) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY environment variable.");
    }
    if (!process.env.TAVILY_API_KEY) {
      throw new Error("Missing TAVILY_API_KEY environment variable.");
    }

    // Step 1: Initialize Tavily and perform live internet search
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
    const searchResponse = await tvly.search(query, {
      searchDepth: "advanced",
      maxResults: 8
    });

    // Step 2: Prepare the raw search data for OpenAI
    const rawSnippets = searchResponse.results.map((r: any) => ({
      title: r.title,
      url: r.url,
      content: r.content
    }));

    const filterString = Object.entries(filters)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");

    // Step 3: Pass raw data to OpenAI for strict structuring
    const systemPrompt = `You are an expert scholarship and grant researcher and database engineer.
You are provided with a JSON array of raw search results from the live internet.
Your task is to extract, deduplicate, and clean this search data into a strictly structured JSON array of highly accurate opportunities that match the user's filters.

You MUST return a JSON object containing an array of opportunities.
The JSON structure MUST exactly match this schema:
{
  "opportunities": [
    {
      "title": "Name of the opportunity",
      "type": "scholarship" | "internship" | "grant",
      "provider": "Name of the offering organization",
      "description": "Clear overview of what it covers",
      "fundingAmount": "Text string (e.g. 'Full Tuition', '$5,000 Stipend', 'Paid')",
      "eligibilityObject": {
        "degreeLevel": ["High School", "Undergraduate", "Postgraduate", "PhD"],
        "targetCountries": ["List", "Of", "Eligible", "Countries", "or 'International'"],
        "incomeCeiling": "String if applicable, else omit"
      },
      "location": "Remote" | "On-site" | "International",
      "deadline": "YYYY-MM-DD or fallback placeholder text if not specified",
      "sourceUrl": "The exact URL extracted from the search result"
    }
  ]
}

Ensure you only extract valid opportunities from the provided raw data. Do not hallucinate URLs. Return at least 3-5 high-quality results if available.`;

    const userPrompt = `Filters: ${filterString}\n\nRaw Search Data:\n${JSON.stringify(rawSnippets, null, 2)}\n\nPlease extract and structure the opportunities now.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3, // Lower temperature for more factual extraction
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    return parsed.opportunities || [];
  } catch (error: any) {
    console.error("AI Ingestion Error:", error);
    throw new Error(error.message || "Failed to scan the web");
  }
}
