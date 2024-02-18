import { Suspense } from 'react';

import Loading from '@/app/loading';
import OrderItemList from '@/components/orderItems/OrderItemList';
import { getOrderItems } from '@/lib/api/orderItems/queries';
import { getVariants } from '@/lib/api/variants/queries';
import { getOrders } from '@/lib/api/orders/queries';
import { checkAuth } from '@/lib/auth/utils';
import { getProducts } from '@/lib/api/products/queries';

export const revalidate = 0;

export default async function OrderItemsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Order Items</h1>
        </div>
        <OrderItems />
      </div>
    </main>
  );
}

const OrderItems = async () => {
  await checkAuth();

  const { orderItems } = await getOrderItems();
  const { variants } = await getVariants();
  const { orders } = await getOrders();
  const { products } = await getProducts();
  return (
    <Suspense fallback={<Loading />}>
      <OrderItemList
        products={products}
        orderItems={orderItems}
        variants={variants}
        orders={orders}
      />
    </Suspense>
  );
};
