"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { tavily } from "@tavily/core";

// We'll initialize genAI inside the function to ensure the API key check happens first.

export async function searchAndStructureOpportunities(query: string, filters: Record<string, string>) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY environment variable.");
    }
    if (!process.env.TAVILY_API_KEY) {
      throw new Error("Missing TAVILY_API_KEY environment variable.");
    }

    // Step 0: Check Input Query
    const safeQuery = (query && typeof query === "string" && query.trim() !== "") ? query.trim() : "General opportunities";

    // Step 1: Initialize Tavily and perform live internet search
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
    let searchResponse: any = {};
    try {
      searchResponse = await tvly.search(safeQuery, {
        searchDepth: "advanced",
        maxResults: 8
      });
    } catch (e: any) {
      console.warn("Tavily search failed, proceeding with empty results.", e);
    }

    // Step 2: Prepare the raw search data safely using optional chaining
    const rawSnippets = (searchResponse.results || []).map((r: any) => ({
      title: r?.title || "Unknown Title",
      url: r?.url || "",
      content: r?.content || ""
    }));

    const safeFilters = filters || {};
    const filterString = Object.entries(safeFilters)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");

    // Step 3: Pass raw data to Gemini for strict structuring
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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

    const combinedPrompt = systemPrompt + "\n\n" + userPrompt;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: combinedPrompt }] }],
      generationConfig: {
        temperature: 0.3
      }
    });

    let content = result.response.text();
    if (!content) {
      throw new Error("No response from Gemini");
    }

    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError, content);
      throw new Error("Failed to parse the structured data from AI.");
    }

    return { success: true, data: parsed.opportunities || [] };
  } catch (error: any) {
    console.error("AI Ingestion Error:", error);
    return { success: false, message: error.message || "An unexpected error occurred while scanning the web." };
  }
}
