import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getOrderItemById } from '@/lib/api/orderItems/queries';
import { getVariants } from '@/lib/api/variants/queries';
import { getOrders } from '@/lib/api/orders/queries';
import OptimisticOrderItem from '@/app/(app)/admin/order-items/[orderItemId]/OptimisticOrderItem';
import { checkAuth } from '@/lib/auth/utils';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getUsers } from '@/lib/api/users/queries';
import { getProducts } from '@/lib/api/products/queries';

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
  const { users } = await getUsers();
  const { products } = await getProducts();

  if (!orderItem) notFound();

  const customer = users?.find((user) => user.id === orderItem.userId);

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="order-items" />
        <OptimisticOrderItem
          products={products}
          orderItem={orderItem}
          variants={variants}
          variantId={orderItem.variantId ?? undefined}
          orders={orders}
          orderId={orderItem.orderId}
          customer={customer}
        />
      </div>
    </Suspense>
  );
};
