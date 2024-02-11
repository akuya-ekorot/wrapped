'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/orders/useOptimisticOrders';
import { type Order } from '@/lib/db/schema/orders';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import OrderForm from '@/components/orders/OrderForm';
import {
  type DeliveryZone,
  type DeliveryZoneId,
} from '@/lib/db/schema/deliveryZones';

export default function OptimisticOrder({
  order,
  deliveryZones,
  deliveryZoneId,
}: {
  order: Order;

  deliveryZones: DeliveryZone[];
  deliveryZoneId?: DeliveryZoneId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Order) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticOrder, setOptimisticOrder] = useOptimistic(order);
  const updateOrder: TAddOptimistic = (input) =>
    setOptimisticOrder({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <OrderForm
          order={order}
          deliveryZones={deliveryZones}
          deliveryZoneId={deliveryZoneId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateOrder}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{order.status}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticOrder.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticOrder, null, 2)}
      </pre>
    </div>
  );
}
