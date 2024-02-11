import { Suspense } from "react";

import Loading from "@/app/loading";
import OrderList from "@/components/orders/OrderList";
import { getOrders } from "@/lib/api/orders/queries";
import { getDeliveryZones } from "@/lib/api/deliveryZones/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function OrdersPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Orders</h1>
        </div>
        <Orders />
      </div>
    </main>
  );
}

const Orders = async () => {
  await checkAuth();

  const { orders } = await getOrders();
  const { deliveryZones } = await getDeliveryZones();
  return (
    <Suspense fallback={<Loading />}>
      <OrderList orders={orders} deliveryZones={deliveryZones} />
    </Suspense>
  );
};
