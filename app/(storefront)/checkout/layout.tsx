import CheckoutStepProvider from '@/components/CheckoutStepsProvider';
import DeliveryZoneProvider from '@/components/DeliveryProvider';
import OrderTypeProvider from '@/components/OrderTypeProvider';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DeliveryZoneProvider>
      <CheckoutStepProvider>
        <OrderTypeProvider>{children}</OrderTypeProvider>
      </CheckoutStepProvider>
    </DeliveryZoneProvider>
  );
}
