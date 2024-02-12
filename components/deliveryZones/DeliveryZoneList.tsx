'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type DeliveryZone,
  CompleteDeliveryZone,
} from '@/lib/db/schema/deliveryZones';
import Modal from '@/components/shared/Modal';

import { useOptimisticDeliveryZones } from '@/app/(app)/admin/delivery-zones/useOptimisticDeliveryZones';
import { Button } from '@/components/ui/button';
import DeliveryZoneForm from './DeliveryZoneForm';
import { PlusIcon } from 'lucide-react';
import { DataTable } from '../shared/data-table';
import { columns } from './columns';

type TOpenModal = (deliveryZone?: DeliveryZone) => void;

export default function DeliveryZoneList({
  deliveryZones,
}: {
  deliveryZones: CompleteDeliveryZone[];
}) {
  const { optimisticDeliveryZones, addOptimisticDeliveryZone } =
    useOptimisticDeliveryZones(deliveryZones);
  const [open, setOpen] = useState(false);
  const [activeDeliveryZone, setActiveDeliveryZone] =
    useState<DeliveryZone | null>(null);
  const openModal = (deliveryZone?: DeliveryZone) => {
    setOpen(true);
    deliveryZone
      ? setActiveDeliveryZone(deliveryZone)
      : setActiveDeliveryZone(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeDeliveryZone ? 'Edit DeliveryZone' : 'Create Delivery Zone'
        }
      >
        <DeliveryZoneForm
          deliveryZone={activeDeliveryZone}
          addOptimistic={addOptimisticDeliveryZone}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticDeliveryZones.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable
          resourceName="delivery zones"
          columns={columns}
          data={optimisticDeliveryZones}
        />
      )}
    </div>
  );
}

const DeliveryZone = ({
  deliveryZone,
  openModal,
}: {
  deliveryZone: CompleteDeliveryZone;
  openModal: TOpenModal;
}) => {
  const optimistic = deliveryZone.id === 'optimistic';
  const deleting = deliveryZone.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('delivery-zones')
    ? pathname
    : pathname + '/delivery-zones/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{deliveryZone.name}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + deliveryZone.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No delivery zones
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new delivery zone.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Delivery Zones{' '}
        </Button>
      </div>
    </div>
  );
};
