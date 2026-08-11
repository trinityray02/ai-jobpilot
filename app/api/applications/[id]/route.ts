import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const allowedStatuses = [
      "Applied",
      "Interview",
      "Offer",
      "Rejected",
    ];

    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid application status." },
        { status: 400 }
      );
    }

    const application = await prisma.application.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Update application error:", error);

    return NextResponse.json(
      { error: "Unable to update application." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete application error:", error);

    return NextResponse.json(
      { error: "Unable to delete application." },
      { status: 500 }
    );
  }
}