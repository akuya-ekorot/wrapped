'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/order-items/useOptimisticOrderItems';
import { type OrderItem } from '@/lib/db/schema/orderItems';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import OrderItemForm from '@/components/orderItems/OrderItemForm';
import { type Variant, type VariantId } from '@/lib/db/schema/variants';
import { type Order, type OrderId } from '@/lib/db/schema/orders';

export default function OptimisticOrderItem({
  orderItem,
  variants,
  variantId,
  orders,
  orderId,
}: {
  orderItem: OrderItem;

  variants: Variant[];
  variantId?: VariantId;
  orders: Order[];
  orderId?: OrderId;
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

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <OrderItemForm
          orderItem={orderItem}
          variants={variants}
          variantId={variantId}
          orders={orders}
          orderId={orderId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateOrderItem}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{orderItem.quantity}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticOrderItem.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticOrderItem, null, 2)}
      </pre>
    </div>
  );
}
