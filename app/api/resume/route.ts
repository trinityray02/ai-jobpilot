import { NextResponse } from "next/server";

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

    return NextResponse.json({
      success: true,
      fileName: resume.name,
      fileSize: resume.size,
      fileType: resume.type,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    return NextResponse.json(
      { error: "Unable to upload resume." },
      { status: 500 }
    );
  }
}