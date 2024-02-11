import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getOrderItemById } from '@/lib/api/orderItems/queries';
import { getVariants } from '@/lib/api/variants/queries';
import { getOrders } from '@/lib/api/orders/queries';
import OptimisticOrderItem from '@/app/(app)/order-items/[orderItemId]/OptimisticOrderItem';
import { checkAuth } from '@/lib/auth/utils';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function OrderItemPage({
  params,
}: {
  params: { orderItemId: string };
}) {
  return (
    <main className="overflow-auto">
      <OrderItem id={params.orderItemId} />
    </main>
  );
}

const OrderItem = async ({ id }: { id: string }) => {
  await checkAuth();

  const { orderItem } = await getOrderItemById(id);
  const { variants } = await getVariants();
  const { orders } = await getOrders();

  if (!orderItem) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="order-items" />
        <OptimisticOrderItem
          orderItem={orderItem}
          variants={variants}
          variantId={orderItem.variantId}
          orders={orders}
          orderId={orderItem.orderId}
        />
      </div>
    </Suspense>
  );
};
