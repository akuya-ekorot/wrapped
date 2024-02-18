'use client';

import { TAddOptimistic } from '@/app/(app)/admin/orders/useOptimisticOrders';
import { CompleteOrder, type Order } from '@/lib/db/schema/orders';
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
import { Customer } from '@/lib/db/schema/customers';
import OrderInfoList from '@/components/orders/OrderInfoList';

export default function OptimisticOrder({
  order,
  deliveryZones,
  deliveryZoneId,
  payments,
  customer,
  customers,
}: {
  order: CompleteOrder;
  payments: Payment[];
  deliveryZones: DeliveryZone[];
  deliveryZoneId?: DeliveryZoneId;
  customer?: Customer;
  customers: Customer[];
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
          customers={customers}
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
      <OrderInfoList
        customer={customer}
        payment={payments.find((p) => p.id === order.paymentId)?.amount ?? 0}
        order={optimisticOrder}
      />
    </div>
  );
}
