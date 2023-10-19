import React from "react";
import BillboardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CategoryColumn } from "./components/columns";
import { format } from "date-fns";
import CategoryClient from "./components/client";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();
  const { storeId } = params;

  if (!userId) {
    redirect("/sign-in");
  }

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((el) => ({
    id: el.id,
    name: el.name,
    billboardLabel: el.billboard.label,
    createdAt: format(el.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
