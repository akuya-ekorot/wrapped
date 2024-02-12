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

export default function OptimisticOrderItem({
  orderItem,
  variants,
  variantId,
  orders,
  orderId,
  customer: customer,
}: {
  orderItem: CompleteOrderItem;
  variants: Variant[];
  variantId?: VariantId;
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
        <h1 className="font-semibold text-2xl">{orderItem.variant?.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(optimisticOrderItem)
          .filter(([key]) => !['id', 'createdAt', 'updatedAt'].includes(key))
          .filter(([key]) => key !== 'variantId' && key !== 'orderId')
          .map(([key, value]) =>
            key === 'variant' ? (
              <InfoListItem
                key={key}
                title={'Product Variant'}
                //@ts-ignore
                value={value.name}
              />
            ) : key === 'userId' ? (
              <InfoListItem
                key={key}
                title={'Customer'}
                //@ts-ignore
                value={customer?.name}
                secondaryValue={customer?.email}
              />
            ) : key === 'order' ? null : (
              <InfoListItem
                key={key}
                title={key}
                value={value as string | number | Date}
              />
            ),
          )}
      </div>
    </div>
  );
}
