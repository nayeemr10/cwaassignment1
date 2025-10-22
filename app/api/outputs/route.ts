import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const items = await prisma.output.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await prisma.output.create({
    data: { kind: body.kind ?? "escape-output", html: body.html ?? "" },
  });
  return NextResponse.json(item, { status: 201 });
}
