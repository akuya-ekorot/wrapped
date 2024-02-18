'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/order-items/useOptimisticOrderItems';
import { CompleteOrderItem, type OrderItem } from '@/lib/db/schema/orderItems';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import OrderItemForm from '@/components/orderItems/OrderItemForm';
import { type Variant, type VariantId } from '@/lib/db/schema/variants';
import { type Order, type OrderId } from '@/lib/db/schema/orders';
import InfoListItem from '@/components/shared/InfoListItem';
import { User } from '@/lib/db/schema/auth';
import { Product, ProductId } from '@/lib/db/schema/products';
import OrderItemInfoList from '@/components/orderItems/OrderItemInfoList';

export default function OptimisticOrderItem({
  orderItem,
  variants,
  variantId,
  productId,
  products,
  orders,
  orderId,
  customer,
}: {
  orderItem: CompleteOrderItem;
  variants: Variant[];
  variantId?: VariantId;
  products: Product[];
  productId?: ProductId;
  orders: Order[];
  orderId?: OrderId;
  customer?: User;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: OrderItem) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticOrderItem, setOptimisticOrderItem] =
    useOptimistic(orderItem);
  const updateOrderItem: TAddOptimistic = (input) =>
    setOptimisticOrderItem({ ...input.data });

  const product = products.find(
    (product) => product.id === orderItem.productId,
  );

  const variant = variants.find(
    (variant) => variant.id === orderItem.variantId,
  );

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <OrderItemForm
          products={products}
          orderItem={orderItem}
          variants={variants}
          variantId={variantId}
          productId={productId}
          orders={orders}
          orderId={orderId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateOrderItem}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {product ? product.name : variant?.name}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <OrderItemInfoList
        product={product}
        variant={variant}
        orderItem={optimisticOrderItem}
      />
    </div>
  );
}
