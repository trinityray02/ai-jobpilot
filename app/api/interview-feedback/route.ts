import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, answer, jobTitle } = body;

    if (!question || !answer || !jobTitle) {
      return NextResponse.json(
        { error: "Question, answer, and job title are required." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are an expert technical interviewer.

Evaluate a candidate's interview answer.

Return ONLY valid JSON in this exact format:

{
  "overallScore": 0,
  "technicalAccuracy": 0,
  "communication": 0,
  "completeness": 0,
  "strengths": [],
  "improvements": [],
  "betterAnswer": ""
}

Rules:
- Each score must be an integer from 0 to 10.
- Be constructive but realistic.
- strengths must contain 1 to 3 concise items.
- improvements must contain 1 to 3 concise items.
- betterAnswer should provide an example of a stronger answer.
- Judge the answer in context of the requested job.
- Do not return markdown.
- Do not use backticks.
- Return JSON only.
          `,
        },
        {
          role: "user",
          content: `
JOB TITLE:
${jobTitle}

INTERVIEW QUESTION:
${question}

CANDIDATE ANSWER:
${answer}
          `,
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

    const feedback = JSON.parse(text);

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Interview feedback error:", error);

    return NextResponse.json(
      { error: "Unable to evaluate interview answer." },
      { status: 500 }
    );
  }
}