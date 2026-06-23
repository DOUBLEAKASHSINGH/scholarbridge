"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
const pdf = require("pdf-parse");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function parseResumeAction(formData: FormData) {
  try {
    const file = formData.get("resume") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    // Convert File to Buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer();
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

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1
      }
    });

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
      return null;
    }
  } catch (error) {
    console.error("Error parsing resume:", error);
    return null;
  }
}
