'use client';

import CheckoutProducts from './checkout-products';
import ClientCustomerForm from '@/components/customers/ClientCustomerForm';
import { useCustomer } from '@/components/CustomerProvider';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductStatus } from '@/lib/db/schema/products';
import { cn } from '@/lib/utils';
import { OrderType } from '@/lib/db/schema/orders';
import { DeliveryZone } from '@/lib/db/schema/deliveryZones';
import { getDeliveryZonesAction } from '@/lib/actions/deliveryZones';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useDeliveryZone } from '@/components/DeliveryProvider';

export default function Page() {
  const customer = useCustomer()((state) => state.customer);
  const [step, setStep] = useState(1);

  return (
    <main className="grid grid-cols-2 divide-x min-h-[90vh]">
      <div className="p-8 space-y-4 flex flex-col mt-8">
        {step === 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-2xl">Contact</p>
            </div>
            <ClientCustomerForm setStep={setStep} />
          </>
        )}
        {step === 1 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-2xl">Shipping</p>
            </div>
            <Shipping />
          </>
        )}
        {step === 2 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-2xl">Review</p>
            </div>
            <Review />
          </>
        )}
        {step === 3 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-2xl">Payment</p>
            </div>
            <Payment />
          </>
        )}
        {step === 4 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-2xl">Confirmation</p>
            </div>
            <Confirmation />
          </>
        )}
      </div>
      <div className="p-8 space-y-4 flex flex-col mt-8">
        <CheckoutProducts />
      </div>
    </main>
  );
}

function Shipping() {
  const [orderType, setOrderType] = useState<string>();
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const { deliveryZone, setDeliveryZone } = useDeliveryZone()();

  useEffect(() => {
    getDeliveryZonesAction().then((zones) => {
      setDeliveryZones(zones);
    });
  }, [setDeliveryZones]);

  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  const handleDeliveryZoneChange = (zoneId: string) => {
    const zone = deliveryZones.find((zone) => zone.id === zoneId);
    setDeliveryZone(zone ?? null);
  };

  return (
    <div className="space-y-8">
      <Select onValueChange={setOrderType} name="orderType">
        <SelectTrigger className={cn('')}>
          <SelectValue placeholder="Delivery or Pickup" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(OrderType).map(([key, value]) => (
            <SelectItem key={value} value={value}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {orderType === OrderType.Delivery && (
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-lg text-primary">Delivery Zones</p>
            <p className="text-xs text-primary">
              Pick a delivery zone closest to your location to get the
              appropriate delivery cost.
            </p>
          </div>
          <ScrollArea className="h-[240px] border-b">
            <RadioGroup onValueChange={handleDeliveryZoneChange}>
              {deliveryZones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex items-center space-x-4 p-4 border"
                >
                  <RadioGroupItem id={zone.name} value={zone.id} />
                  <div className="space-y-1 w-full">
                    <Label htmlFor={zone.name} className={cn('')}>
                      {zone.name}
                    </Label>
                    <p className="text-xs">{zone.description}</p>
                  </div>
                  <div className="w-full text-right">
                    <p>+{formatter.format(zone.deliveryCost)}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>
        </div>
      )}

      <div className="w-full flex justify-end">
        <Button
          disabled={
            !orderType || (orderType === OrderType.Delivery && !deliveryZone)
          }
        >
          Review order
        </Button>
      </div>
    </div>
  );
}

function Review() {
  return (
    <div>
      <p>Shipping</p>
    </div>
  );
}

function Payment() {
  return (
    <div>
      <p>Shipping</p>
    </div>
  );
}

function Confirmation() {
  return (
    <div>
      <p>Shipping</p>
    </div>
  );
}
