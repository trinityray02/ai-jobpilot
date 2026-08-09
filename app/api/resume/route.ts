import { getPath } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import { NextResponse } from "next/server";

PDFParse.setWorker(getPath());

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const resume = formData.get("resume");

    if (!(resume instanceof File)) {
      return NextResponse.json(
        { error: "Resume file is required." },
        { status: 400 }
      );
    }

    if (resume.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF resumes are supported." },
        { status: 400 }
      );
    }

    const arrayBuffer = await resume.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    const resumeText = result.text?.trim() || "";

    if (!resumeText) {
      return NextResponse.json(
        {
          error:
            "The PDF opened successfully, but no readable text was found.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      fileName: resume.name,
      fileSize: resume.size,
      resumeText,
    });
  } catch (error) {
    console.error("Resume parsing error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to read the resume.",
      },
      { status: 500 }
    );
  }
}