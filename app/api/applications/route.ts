import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);

    return NextResponse.json(
      { error: "Unable to load applications." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { company, role, status, date } = body;

    if (!company?.trim() || !role?.trim()) {
      return NextResponse.json(
        { error: "Company and role are required." },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        company: company.trim(),
        role: role.trim(),
        status: status || "Applied",
        date: date
          ? new Date(`${date}T12:00:00`)
          : new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create application error:", error);

    return NextResponse.json(
      { error: "Unable to create application." },
      { status: 500 }
    );
  }
}