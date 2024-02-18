import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getOrderByIdWithOrderItems } from '@/lib/api/orders/queries';
import { getDeliveryZones } from '@/lib/api/deliveryZones/queries';
import OptimisticOrder from './OptimisticOrder';
import { checkAuth } from '@/lib/auth/utils';
import OrderItemList from '@/components/orderItems/OrderItemList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getVariants } from '@/lib/api/variants/queries';
import { getPayments } from '@/lib/api/payments/queries';
import { getUsers } from '@/lib/api/users/queries';
import { CompleteOrder } from '@/lib/db/schema/orders';

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
  const { variants } = await getVariants();
  const { payments } = await getPayments();
  const { users } = await getUsers();
  const { products } = await getProdcuts();

  if (!order) notFound();

  const customer = users?.find((u) => u.id === order.userId);

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="orders" />
        <OptimisticOrder
          payments={payments}
          order={order as CompleteOrder}
          deliveryZones={deliveryZones}
          customer={customer}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {customer?.name}&apos;s Order Items
        </h3>
        <OrderItemList
          products={products}
          variants={variants}
          orders={[]}
          orderId={order.id}
          orderItems={orderItems}
        />
      </div>
    </Suspense>
  );
};
function getProdcuts(): { products: any } | PromiseLike<{ products: any }> {
  throw new Error('Function not implemented.');
}
