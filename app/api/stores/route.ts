import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!body.name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name: body.name,
        userId,
      },
    });
    return NextResponse.json(store);
  } catch (err) {
    console.log("stores-POST   ", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
