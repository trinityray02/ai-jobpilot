import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobDescription } = body;

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are an AI career assistant.

Your job is to analyze job descriptions and return structured JSON.

The candidate currently has experience with:
- TypeScript
- React
- Node.js
- Git
- REST APIs
- Python
- PostgreSQL

Return ONLY valid JSON using this exact structure:

{
  "matchScore": 0,
  "detectedSkills": [],
  "missingSkills": [],
  "recommendations": []
}

Rules:

- matchScore must be a number between 0 and 100.
- detectedSkills must contain relevant skills the candidate has.
- missingSkills must contain important skills required by the job that the candidate does not have.
- recommendations must contain exactly 3 useful recommendations.
- Do not return markdown.
- Do not use backticks.
- Do not include explanations outside the JSON.
          `,
        },
        {
          role: "user",
          content: jobDescription,
        },
      ],

      temperature: 0.2,
      response_format: {
        type: "json_object",
      },
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error("AI returned an empty response.");
    }

    const analysis = JSON.parse(text);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Job analysis error:", error);

    return NextResponse.json(
      {
        error: "AI analysis failed. Please try again.",
      },
      { status: 500 }
    );
  }
}