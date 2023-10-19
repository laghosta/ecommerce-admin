import React from "react";
import SizeClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { format } from "date-fns";
import { SizeColumn } from "@/app/(dashboard)/[storeId]/(routes)/sizes/components/columns";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();
  const { storeId } = params;

  if (!userId) {
    redirect("/sign-in");
  }

  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((el) => ({
    id: el.id,
    name: el.name,
    value: el.value,
    createdAt: format(el.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
