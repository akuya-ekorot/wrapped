'use client';

import { TAddOptimistic } from '@/app/(app)/admin/delivery-zones/useOptimisticDeliveryZones';
import { type DeliveryZone } from '@/lib/db/schema/deliveryZones';
import { useOptimistic, useState } from 'react';

import DeliveryZoneForm from '@/components/deliveryZones/DeliveryZoneForm';
import InfoListItem from '@/components/shared/InfoListItem';
import Modal from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import DeliveryZoneInfoList from '@/components/deliveryZones/DeliveryZoneInfoList';

export default function OptimisticDeliveryZone({
  deliveryZone,
}: {
  deliveryZone: DeliveryZone;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: DeliveryZone) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticDeliveryZone, setOptimisticDeliveryZone] =
    useOptimistic(deliveryZone);
  const updateDeliveryZone: TAddOptimistic = (input) =>
    setOptimisticDeliveryZone({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <DeliveryZoneForm
          deliveryZone={deliveryZone}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateDeliveryZone}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{deliveryZone.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <DeliveryZoneInfoList deliveryZone={optimisticDeliveryZone} />
    </div>
  );
}
