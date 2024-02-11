import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getOrderByIdWithOrderItems } from "@/lib/api/orders/queries";
import { getDeliveryZones } from "@/lib/api/deliveryZones/queries";import OptimisticOrder from "./OptimisticOrder";
import { checkAuth } from "@/lib/auth/utils";
import OrderItemList from "@/components/orderItems/OrderItemList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function OrderPage({
  params,
}: {
  params: { orderId: string };
}) {

  return (
    <main className="overflow-auto">
      <Order id={params.orderId} />
    </main>
  );
}

const Order = async ({ id }: { id: string }) => {
  await checkAuth();

  const { order, orderItems } = await getOrderByIdWithOrderItems(id);
  const { deliveryZones } = await getDeliveryZones();

  if (!order) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="orders" />
        <OptimisticOrder order={order} deliveryZones={deliveryZones} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{order.status}&apos;s Order Items</h3>
        <OrderItemList
          orders={[]}
          orderId={order.id}
          orderItems={orderItems}
        />
      </div>
    </Suspense>
  );
};