"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
const pdf = require("pdf-parse");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function parseResumeAction(url: string) {
  try {
    if (!url) {
      throw new Error("No URL provided");
    }

    console.log("Fetching resume from URL:", url);

    // Basic Google Drive link transformer
    let fetchUrl = url;
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        fetchUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
        console.log("Transformed Google Drive link to direct download:", fetchUrl);
      }
    }

    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from URL: ${response.statusText}`);
    }

    console.log("Starting PDF-to-Text conversion...");
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF text
    const data = await pdf(buffer);
    const text = data.text;

    if (!text || text.trim() === "") {
      throw new Error("Could not extract text from PDF");
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy_key") {
      // Dummy response for missing API key
      return {
        skills: ["JavaScript", "React", "Next.js"],
        professionalSummary: "This is a dummy parsed summary due to missing API key.",
        educationHistory: [{ degree: "B.S. Computer Science", institute: "Dummy University", year: "2026" }],
        projects: [{ name: "ScholarBridge", description: "A scholarship matching platform", techStack: ["Next.js", "Firebase"] }]
      };
    }

    // Pass text to Gemini
    const prompt = `
      You are an expert career consultant. Analyze the provided resume text and extract the following into a clean JSON object: 
      - skills (array of strings)
      - educationHistory (array of objects with 'degree', 'institute', 'year')
      - projects (array of objects with 'name', 'description', 'techStack' - where techStack is an array of strings)
      - professionalSummary (string - a short professional summary)
      
      Ensure the output is strictly valid JSON without any markdown formatting wrappers.
      
      Resume Text:
      ${text}
    `;

    console.log("Sending text to Gemini...");
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    
    // Add 20-second timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Gemini API call timed out after 20 seconds")), 20000)
    );

    const apiCallPromise = model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1
      }
    });

    const result = await Promise.race([apiCallPromise, timeoutPromise]) as any;
    console.log("Received response from Gemini");

    let content = result.response.text();
    if (!content) throw new Error("No content generated");

    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(content);
      return {
        skills: parsed.skills || [],
        educationHistory: parsed.educationHistory || parsed.education || [],
        projects: parsed.projects || [],
        professionalSummary: parsed.professionalSummary || ""
      };
    } catch (e) {
      console.error("Failed to parse Gemini output:", e);
      throw new Error("Failed to parse Gemini JSON output");
    }
  } catch (error: any) {
    console.error("Error parsing resume:", error);
    return { error: error.message || "An unknown error occurred" };
  }
}
