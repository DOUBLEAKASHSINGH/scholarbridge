import { NextRequest, NextResponse } from "next/server";
import { tavily } from "@tavily/core";

export async function GET(req: NextRequest) {
  try {
    if (!process.env.TAVILY_API_KEY) {
      return NextResponse.json({ success: false, error: "Tavily API key is missing in environment variables." }, { status: 400 });
    }

    const client = tavily({ apiKey: process.env.TAVILY_API_KEY });
    const query = "scholarships for college students";
    
    const response = await client.search(query, {
      searchDepth: "basic",
      maxResults: 3
    });

    return NextResponse.json({ success: true, query, response });
  } catch (error: any) {
    console.error("Tavily Test Route Error:", error);
    return NextResponse.json({ success: false, error: error?.message || "An unexpected processing error occurred." }, { status: 500 });
  }
}
