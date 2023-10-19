import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(store);
  } catch (err) {
    console.log("STORE_PATCH   ", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!params.storeId) {
      return new NextResponse("Store is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });
    return NextResponse.json(store);
  } catch (err) {
    console.log("STORE_DELETE   ", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
