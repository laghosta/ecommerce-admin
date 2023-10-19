import React from "react";
import BillboardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BillboardColumn } from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/columns";
import { format } from "date-fns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();
  const { storeId } = params;

  if (!userId) {
    redirect("/sign-in");
  }

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((el) => ({
    id: el.id,
    label: el.label,
    createdAt: format(el.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
