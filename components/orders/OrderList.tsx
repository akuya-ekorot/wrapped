'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { type Order, CompleteOrder } from '@/lib/db/schema/orders';
import Modal from '@/components/shared/Modal';
import {
  type DeliveryZone,
  type DeliveryZoneId,
} from '@/lib/db/schema/deliveryZones';
import { useOptimisticOrders } from '@/app/(app)/admin/orders/useOptimisticOrders';
import { Button } from '@/components/ui/button';
import OrderForm from './OrderForm';
import { PlusIcon } from 'lucide-react';
import { Payment } from '@/lib/db/schema/payments';
import { DataTable } from '../shared/data-table';
import { columns } from './columns';
import { Customer } from '@/lib/db/schema/customers';

type TOpenModal = (order?: CompleteOrder) => void;

export default function OrderList({
  payments,
  orders,
  deliveryZones,
  deliveryZoneId,
  customers,
}: {
  customers: Customer[];
  payments: Payment[];
  orders: CompleteOrder[];
  deliveryZones: DeliveryZone[];
  deliveryZoneId?: DeliveryZoneId;
}) {
  const { optimisticOrders, addOptimisticOrder } = useOptimisticOrders(
    orders,
    deliveryZones,
    payments,
  );
  const [open, setOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<CompleteOrder | null>(null);
  const openModal = (order?: CompleteOrder) => {
    setOpen(true);
    order ? setActiveOrder(order) : setActiveOrder(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeOrder ? 'Edit Order' : 'Create Order'}
      >
        <OrderForm
          customers={customers}
          payments={payments}
          order={activeOrder}
          addOptimistic={addOptimisticOrder}
          openModal={openModal}
          closeModal={closeModal}
          deliveryZones={deliveryZones}
          deliveryZoneId={deliveryZoneId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticOrders.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable
          searchColumn="name"
          resourceName="orders"
          data={optimisticOrders}
          columns={columns}
        />
      )}
    </div>
  );
}

const Order = ({
  order,
  openModal,
}: {
  order: CompleteOrder;
  openModal: TOpenModal;
}) => {
  const optimistic = order.id === 'optimistic';
  const deleting = order.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('orders')
    ? pathname
    : pathname + '/orders/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{order.status}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + order.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No orders
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new order.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Orders{' '}
        </Button>
      </div>
    </div>
  );
};
