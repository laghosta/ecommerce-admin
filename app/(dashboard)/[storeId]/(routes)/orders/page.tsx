import React from "react";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns";
import { priceFormatter } from "@/lib/utils";
import { OrderItem } from "@prisma/client";
import OrderClient from "./components/client";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();
  const { storeId } = params;

  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await prismadb.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((el) => ({
    id: el.id,
    phone: el.phone,
    address: el.address,
    products: el.orderItems.map((el) => el.product.name).join(", "),
    totalPrice: priceFormatter.format(
      el.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    isPaid: el.isPaid,
    createdAt: format(el.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
