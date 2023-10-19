import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required!", { status: 401 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (err) {
    console.log("BILLBOARD_GET   ", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (err) {
    console.log("BILLBOARD_PATCH   ", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!params.storeId) {
      return new NextResponse("Store is required", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required!", { status: 401 });
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

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (err) {
    console.log("BILLBOARD_DELETE   ", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
