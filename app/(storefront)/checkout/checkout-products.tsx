'use client';

import { useCart } from '@/components/CartProvider';
import { useDeliveryZone } from '@/components/DeliveryProvider';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useEffect } from 'react';

export default function CheckoutProducts() {
  const { cart, setCart } = useCart()();
  const deliveryZone = useDeliveryZone()((state) => state.deliveryZone);

  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  return (
    <div className="divide-y">
      <div>
        {cart.items.map((item) => (
          <div key={item.variant.id} className="flex gap-4 text-sm">
            <div className="h-24 w-24 rounded relative">
              <Image
                src={item.variant.image.url}
                alt={item.variant.name}
                height={120}
                width={120}
                className="object-cover w-full"
              />
              <Badge variant={'secondary'} className="absolute -top-1 -right-1">
                {item.quantity}
              </Badge>
            </div>
            <div className="space-y-2 w-full">
              <div className="flex justify-between items-center">
                <p>{item.variant.name}</p>
                <p>
                  {formatter.format((item.variant.price ?? 0) * item.quantity)}
                </p>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                {item.variant.options.map((option) => (
                  <Badge key={option.id} className="text-xs">
                    {option.value.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="py-2">
        <div className="flex items-center justify-between py-2 text-sm">
          <p>Sub Total</p>
          <p className="">{formatter.format(cart.totalPrice)}</p>
        </div>
        <div className="flex items-center justify-between py-2 text-sm">
          <p>Shipping</p>
          {deliveryZone ? (
            <p className="">{formatter.format(deliveryZone.deliveryCost)}</p>
          ) : (
            <p className="">N/A</p>
          )}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between py-4 text-primary">
          <p>Total</p>
          <p className="font-semibold text-2xl">
            {formatter.format(
              cart.totalPrice + (deliveryZone?.deliveryCost ?? 0),
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
