import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { jobDescription, resumeText } = body;

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json(
        { error: "Resume text is required." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are an AI resume and job matching assistant.

Compare the candidate's resume against the job description.

Only count a skill as detected when there is reasonable evidence of it
in the resume.

Do not assume the candidate has skills that are not present in the resume.

Return ONLY valid JSON in exactly this structure:

{
  "matchScore": 0,
  "detectedSkills": [],
  "missingSkills": [],
  "recommendations": []
}

Rules:

- matchScore must be an integer from 0 to 100.
- Base the score on relevant skills, experience, tools, technologies,
  education, and qualifications.
- detectedSkills should contain important job requirements that are
  supported by the resume.
- missingSkills should contain important job requirements that are not
  clearly supported by the resume.
- recommendations must contain exactly 3 specific ways the candidate
  could strengthen their application.
- Do not invent candidate experience.
- Do not include markdown.
- Do not include backticks.
- Do not include text outside the JSON.
          `,
        },
        {
          role: "user",
          content: `
CANDIDATE RESUME:

${resumeText}

----------------------------

JOB DESCRIPTION:

${jobDescription}
          `,
        },
      ],

      temperature: 0.1,

      response_format: {
        type: "json_object",
      },
    });

    const text =
      completion.choices[0]?.message?.content;

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
        error:
          "AI analysis failed. Please try again.",
      },
      { status: 500 }
    );
  }
}