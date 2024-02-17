import DeliveryZoneProvider from '@/components/DeliveryProvider';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DeliveryZoneProvider>{children}</DeliveryZoneProvider>;
}
