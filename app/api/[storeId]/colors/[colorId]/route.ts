import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Color Id Id is required!", { status: 401 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (err) {
    console.log("COLOR_GET   ", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value Id is required", { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse("Color Id  is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(size);
  } catch (err) {
    console.log("COLOR_PATCH   ", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!params.storeId) {
      return new NextResponse("Store is required", { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse("Size Id is required!", { status: 401 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    let storeByUserId = null;
    try {
      storeByUserId = await prismadb.store.findFirst({
        where: {
          id: params.storeId,
        },
      });
    } catch (err) {
      storeByUserId = null;
    }
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(size);
  } catch (err) {
    console.log("COLOR_DELETE   ", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
