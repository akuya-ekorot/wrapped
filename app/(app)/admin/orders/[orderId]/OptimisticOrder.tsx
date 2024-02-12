'use client';

import { TAddOptimistic } from '@/app/(app)/admin/orders/useOptimisticOrders';
import { type Order } from '@/lib/db/schema/orders';
import { useOptimistic, useState } from 'react';

import OrderForm from '@/components/orders/OrderForm';
import InfoListItem from '@/components/shared/InfoListItem';
import Modal from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/db/schema/auth';
import {
  type DeliveryZone,
  type DeliveryZoneId,
} from '@/lib/db/schema/deliveryZones';
import { Payment } from '@/lib/db/schema/payments';

export default function OptimisticOrder({
  order,
  deliveryZones,
  deliveryZoneId,
  payments,
  customer: customer,
}: {
  order: Order;
  payments: Payment[];
  deliveryZones: DeliveryZone[];
  deliveryZoneId?: DeliveryZoneId;
  customer?: User;
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
          payments={payments}
          order={order}
          deliveryZones={deliveryZones}
          deliveryZoneId={deliveryZoneId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateOrder}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{customer?.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(optimisticOrder)
          .filter(([key]) => !['id', 'createdAt', 'updatedAt'].includes(key))
          .map(([key, value]) =>
            key === 'deliveryZoneId' ? (
              <InfoListItem
                key={key}
                title={'Delivery Zone'}
                value={deliveryZones.find((dz) => dz.id === value)?.name!}
              />
            ) : key === 'userId' ? (
              <InfoListItem
                key={key}
                title={'Customer'}
                value={customer?.name!}
                secondaryValue={customer?.email!}
              />
            ) : key === 'paymentId' ? (
              <InfoListItem
                key={key}
                title={'Payment Made'}
                value={payments.find((p) => p.id === value)?.amount ?? 0}
              />
            ) : key === 'amount' ? (
              <InfoListItem
                key={key}
                title={'Total Amount Due'}
                value={value}
              />
            ) : (
              <InfoListItem key={key} title={key} value={value} />
            ),
          )}
      </div>
    </div>
  );
}
