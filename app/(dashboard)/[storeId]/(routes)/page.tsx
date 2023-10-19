import React from "react";
import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });
  return (
    <div>
      StoreId page! <div>{store!.name}</div>
    </div>
  );
};

export default DashboardPage;
