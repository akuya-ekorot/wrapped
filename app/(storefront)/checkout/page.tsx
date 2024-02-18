'use client';

import CheckoutProducts from './checkout-products';
import ClientCustomerForm from '@/components/customers/ClientCustomerForm';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Order, OrderType, insertOrderSchema } from '@/lib/db/schema/orders';
import { DeliveryZone } from '@/lib/db/schema/deliveryZones';
import { getDeliveryZonesAction } from '@/lib/actions/deliveryZones';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useDeliveryZone } from '@/components/DeliveryProvider';
import { useCheckoutStep } from '@/components/CheckoutStepsProvider';
import { useCustomer } from '@/components/CustomerProvider';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableRow,
} from '@/components/ui/table';
import { usePaystackPayment } from 'react-paystack';
import { env } from '@/lib/env.mjs';
import { useCart } from '@/components/CartProvider';
import { createPaymentAction } from '@/lib/actions/payments';
import { Payment, insertPaymentSchema } from '@/lib/db/schema/payments';
import { useOrderType } from '@/components/OrderTypeProvider';
import { createOrderAction } from '@/lib/actions/orders';
import { Check } from 'lucide-react';
import { clearCart } from '@/lib/api/cart/mutations';
import { createOrderItemAction } from '@/lib/actions/orderItems';

export default function Page() {
  const { checkoutStep, setCheckoutStep } = useCheckoutStep()();

  return (
    <main className="grid grid-cols-2 divide-x min-h-[90vh]">
      {checkoutStep === 0 && (
        <div className="p-8 space-y-4 flex flex-col mt-8">
          <div className="flex items-center justify-between">
            <p className="text-2xl">Contact</p>
          </div>
          <ClientCustomerForm setStep={setCheckoutStep} />
        </div>
      )}
      {checkoutStep === 1 && (
        <div className="p-8 space-y-4 flex flex-col mt-8">
          <div className="flex items-center justify-between">
            <p className="text-2xl">Shipping</p>
          </div>
          <Shipping />
        </div>
      )}
      {checkoutStep === 2 && (
        <div className="p-8 space-y-4 flex flex-col mt-8">
          <div className="flex items-center justify-between">
            <p className="text-2xl">Review</p>
          </div>
          <Review />
        </div>
      )}
      {checkoutStep === 3 && (
        <div className="col-span-2 p-8 space-y-4 flex flex-col mt-8">
          <div className="flex items-center justify-between">
            <p className="text-2xl">Confirmation</p>
          </div>
          <Confirmation />
        </div>
      )}
      {checkoutStep !== 3 && (
        <div className="p-8 space-y-4 flex flex-col mt-8">
          <CheckoutProducts />
        </div>
      )}
    </main>
  );
}

function Shipping() {
  const { orderType, setOrderType } = useOrderType()();
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const { deliveryZone, setDeliveryZone } = useDeliveryZone()();
  const setCheckoutStep = useCheckoutStep()((state) => state.setCheckoutStep);

  useEffect(() => {
    getDeliveryZonesAction().then((zones) => {
      setDeliveryZones(zones);
    });
  }, [setDeliveryZones]);

  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  const handleOrderTypeChange = (type: string) => {
    if (type === OrderType.Pickup) {
      setDeliveryZone(null);
    }
    setOrderType(type as OrderType);
  };

  const handleDeliveryZoneChange = (zoneId: string) => {
    const zone = deliveryZones.find((zone) => zone.id === zoneId);
    setDeliveryZone(zone ?? null);
  };

  return (
    <div className="space-y-8">
      <Select onValueChange={handleOrderTypeChange} name="orderType">
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
          onClick={() => setCheckoutStep(2)}
        >
          Review order
        </Button>
      </div>
    </div>
  );
}

function Review() {
  const { customer } = useCustomer()();
  const { deliveryZone } = useDeliveryZone()();
  const { cart } = useCart()();
  const { orderType } = useOrderType()();
  const { setCheckoutStep } = useCheckoutStep()();

  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  const initializePayment = usePaystackPayment({
    publicKey: env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    amount: (cart.totalPrice + (deliveryZone?.deliveryCost ?? 0)) * 100,
    email: customer?.email,
    currency: 'KES',
  });

  const createPayment = ({
    reference,
    status,
    amount,
  }: {
    reference: string;
    status: string;
    amount: number;
  }) => {
    const payload = insertPaymentSchema.safeParse({
      reference,
      status,
      amount: String(amount),
    });

    if (!payload.success) {
      throw new Error('Invalid payment payload');
    }

    const PaymentPromise = createPaymentAction(payload.data);
    return PaymentPromise.then(({ data, error }) => {
      if (error || !data) {
        throw new Error('Failed to create payment');
      }
      return data;
    });
  };

  const createOrderItems = ({ order }: { order: Order }) => {
    const promises = cart.items.map((item) => {
      return createOrderItemAction({
        orderId: order.id,
        productId: item.product?.id ?? null,
        variantId: item.variant?.id ?? null,
        quantity: item.quantity,
        amount: item.quantity * (item.variant?.price ?? item.product?.price)!,
      });
    });

    return Promise.all(promises).then((errors) => {
      if (errors.some((error) => error)) {
        throw new Error('Failed to create order items');
      }
    });
  };

  const createOrder = ({ payment }: { payment: Payment }) => {
    const payload = insertOrderSchema.safeParse({
      deliveryZoneId: deliveryZone?.id,
      notes: '',
      amount: cart.totalPrice + (deliveryZone?.deliveryCost ?? 0),
      paymentId: payment.id,
      type: orderType,
      status: payment.status === 'success' ? 'payment_paid' : 'payment_pending',
    });

    if (!payload.success) {
      throw new Error('Invalid order payload');
    }

    const OrderPromise = createOrderAction({
      ...payload.data,
      deliveryZoneId: payload.data.deliveryZoneId ?? null,
      notes: payload.data.notes ?? null,
      customerId: payload.data.customerId ?? null,
    });

    return OrderPromise.then(({ data, error }) => {
      if (error || !data) {
        throw new Error('Failed to create order');
      }

      return data;
    });
  };

  const onSuccess = (response: any) => {
    const { reference, status } = response;

    const payload = {
      reference,
      status,
      amount: cart.totalPrice + (deliveryZone?.deliveryCost ?? 0),
    };

    createPayment(payload)
      .then(createOrder)
      .then(createOrderItems)
      .then(() => setCheckoutStep(3))
      .catch(console.error);
  };

  const onClose = () => {
    console.log('closed');
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[60vh]">
        <div className="space-y-4">
          <div className="border pb-4">
            <Table>
              <TableCaption>Customer Details</TableCaption>
              <TableBody>
                <TableRow>
                  <TableCell className="w-20">Name</TableCell>
                  <TableCell>{customer?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-20">Email</TableCell>
                  <TableCell>{customer?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-20">Phone</TableCell>
                  <TableCell>{customer?.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-20">Country</TableCell>
                  <TableCell>{customer?.country}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-20">City</TableCell>
                  <TableCell>{customer?.city}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-20">Address</TableCell>
                  <TableCell>{customer?.address}</TableCell>
                </TableRow>
                {customer?.extraDetails && (
                  <TableRow>
                    <TableCell className="w-20">Extra Details</TableCell>
                    <TableCell>{customer.extraDetails}</TableCell>
                  </TableRow>
                )}
                {customer?.postalCode && (
                  <TableRow>
                    <TableCell className="w-20">Postal Code</TableCell>
                    <TableCell>{customer.postalCode}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {deliveryZone && (
            <div className="border pb-4">
              <Table>
                <TableCaption>Delivery Zone</TableCaption>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-20">Zone</TableCell>
                    <TableCell>{deliveryZone.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-20">Details</TableCell>
                    <TableCell>{deliveryZone.description}</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="w-20">Delivery Cost</TableCell>
                    <TableCell className="w-20">
                      {formatter.format(deliveryZone.deliveryCost)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="w-full flex justify-end">
        <Button onClick={() => initializePayment({ onSuccess, onClose })}>
          Confrim and Pay
        </Button>
      </div>
    </div>
  );
}

function Confirmation() {
  const { setCart } = useCart()();
  const { setCustomer } = useCustomer()();
  const { setDeliveryZone } = useDeliveryZone()();
  const { setOrderType } = useOrderType()();

  useEffect(() => {
    const setLocalCustomer = () => {
      if (localStorage === undefined) {
        return;
      }
      localStorage.setItem('customer', JSON.stringify({}));
      return;
    };

    clearCart('cart').then((cart) => setCart(cart));
    setLocalCustomer();
    setCustomer(null);
    setDeliveryZone(null);
    setOrderType(null);
  }, [setCart, setCustomer, setDeliveryZone, setOrderType]);

  return (
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
      <Check className="w-12 h-12" />
      <p>Order created successfully. Check your email for a receipt.</p>
    </div>
  );
}
