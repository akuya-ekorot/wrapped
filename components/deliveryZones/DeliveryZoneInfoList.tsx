import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DeliveryZone } from '@/lib/db/schema/deliveryZones';

export default function DeliveryZoneInfoList({
  deliveryZone,
}: {
  deliveryZone: DeliveryZone;
}) {
  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{deliveryZone.name}</CardTitle>
        </CardHeader>
        <CardContent>Name</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">
            {formatter.format(deliveryZone.deliveryCost)}
          </CardTitle>
        </CardHeader>
        <CardContent>Delivery Cost</CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="space-y-2">{'Description'}</CardTitle>
        </CardHeader>
        <CardContent>{deliveryZone.description}</CardContent>
      </Card>
    </div>
  );
}
