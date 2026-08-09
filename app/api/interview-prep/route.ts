import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobTitle } = body;

    if (!jobTitle || !jobTitle.trim()) {
      return NextResponse.json(
        { error: "Job title is required." },
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

Generate exactly 8 realistic interview questions for the requested role.

Return ONLY valid JSON in this exact structure:

{
  "questions": [
    {
      "question": "Question text",
      "category": "Technical"
    }
  ]
}

Rules:
- Include a mix of technical and behavioral questions.
- Make the questions appropriate for the job title.
- Categories should be short, such as Technical, Behavioral, System Design, or Problem Solving.
- Return exactly 8 questions.
- Do not include markdown.
- Do not include backticks.
- Do not include text outside the JSON.
          `,
        },
        {
          role: "user",
          content: `Job title: ${jobTitle}`,
        },
      ],
      temperature: 0.4,
      response_format: {
        type: "json_object",
      },
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error("AI returned an empty response.");
    }

    const result = JSON.parse(text);

    return NextResponse.json({
      success: true,
      questions: result.questions,
    });
  } catch (error) {
    console.error("Interview prep error:", error);

    return NextResponse.json(
      { error: "Unable to generate interview questions." },
      { status: 500 }
    );
  }
}