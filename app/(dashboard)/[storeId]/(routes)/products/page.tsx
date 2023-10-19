import React from "react";
import BillboardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BillboardColumn } from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/columns";
import { format } from "date-fns";
import { priceFormatter } from "@/lib/utils";
import { ProductColumn } from "@/app/(dashboard)/[storeId]/(routes)/products/components/columns";
import ProductClient from "./components/client";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();
  const { storeId } = params;

  if (!userId) {
    redirect("/sign-in");
  }

  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      color: true,
      size: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((el) => ({
    id: el.id,
    name: el.name,
    price: priceFormatter.format(el.price.toNumber()),
    isFeatured: el.isFeatured,
    isArchived: el.isArchived,
    category: el.category.name,
    size: el.size.name,
    color: el.color.value,

    createdAt: format(el.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
