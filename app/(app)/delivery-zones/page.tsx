import { Suspense } from 'react';

import Loading from '@/app/loading';
import DeliveryZoneList from '@/components/deliveryZones/DeliveryZoneList';
import { getDeliveryZones } from '@/lib/api/deliveryZones/queries';

export const revalidate = 0;

export default async function DeliveryZonesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Delivery Zones</h1>
        </div>
        <DeliveryZones />
      </div>
    </main>
  );
}

const DeliveryZones = async () => {
  const { deliveryZones } = await getDeliveryZones();

  return (
    <Suspense fallback={<Loading />}>
      <DeliveryZoneList deliveryZones={deliveryZones} />
    </Suspense>
  );
};
