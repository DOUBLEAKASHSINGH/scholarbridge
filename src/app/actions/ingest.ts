"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { tavily } from "@tavily/core";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function searchAndStructureOpportunities(query: string, filters: Record<string, string>) {
  try {
    // 1. Check the Input Query safely
    const safeQuery = typeof query === "string" && query.trim().length > 0 ? query.trim() : "scholarships and grants";

    // 2. Check the API Keys safely
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey || typeof geminiKey !== "string" || geminiKey.trim() === "") {
      throw new Error("Missing GEMINI_API_KEY environment variable.");
    }
    
    // Simulate a safe split check just in case the user's infrastructure does something weird
    const keyParts = geminiKey.split("-");
    if (keyParts.length === 0) {
      throw new Error("Invalid GEMINI_API_KEY format.");
    }

    const tavilyKey = process.env.TAVILY_API_KEY;
    if (!tavilyKey || typeof tavilyKey !== "string" || tavilyKey.trim() === "") {
      throw new Error("Missing TAVILY_API_KEY environment variable.");
    }

    // Step 1: Initialize Tavily and perform live internet search
    const tvly = tavily({ apiKey: tavilyKey });
    const searchResponse = await tvly.search(safeQuery, {
      searchDepth: "advanced",
      maxResults: 8
    });

    // 3. Safeguard the API Response Processing
    const safeResults = Array.isArray(searchResponse?.results) ? searchResponse.results : [];
    
    const rawSnippets = safeResults.map((r: any) => {
      // Safely access properties and provide fallbacks before any string operations
      const safeTitle = typeof r?.title === "string" ? r.title : "Unknown Title";
      const safeUrl = typeof r?.url === "string" ? r.url : "";
      const safeContent = typeof r?.content === "string" ? r.content : "";
      
      // Optional chaining example as requested by the user
      const urlSegments = safeUrl?.split('/') || [];
      
      return {
        title: safeTitle,
        url: safeUrl,
        content: safeContent,
        domain: urlSegments.length > 2 ? urlSegments[2] : "Unknown Domain"
      };
    });

    const safeFilters = filters || {};
    const filterString = Object.entries(safeFilters)
      .map(([key, val]) => `${key}: ${String(val)}`)
      .join(", ");

    // Step 3: Pass raw data to Gemini for strict structuring
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

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json"
      }
    });

    const content = result.response.text();
    if (!content) {
      throw new Error("No response from Gemini");
    }

    const parsed = JSON.parse(content);
    return { success: true, data: parsed.opportunities || [] };
  } catch (error: any) {
    console.error("AI Ingestion Error:", error);
    return { success: false, message: error.message || "An unexpected error occurred while scanning the web." };
  }
}
