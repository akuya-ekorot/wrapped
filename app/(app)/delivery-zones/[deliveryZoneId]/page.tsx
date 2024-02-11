import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getDeliveryZoneById } from '@/lib/api/deliveryZones/queries';
import OptimisticDeliveryZone from './OptimisticDeliveryZone';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function DeliveryZonePage({
  params,
}: {
  params: { deliveryZoneId: string };
}) {
  return (
    <main className="overflow-auto">
      <DeliveryZone id={params.deliveryZoneId} />
    </main>
  );
}

const DeliveryZone = async ({ id }: { id: string }) => {
  const { deliveryZone } = await getDeliveryZoneById(id);

  if (!deliveryZone) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="delivery-zones" />
        <OptimisticDeliveryZone deliveryZone={deliveryZone} />
      </div>
    </Suspense>
  );
};
