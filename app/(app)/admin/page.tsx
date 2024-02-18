import SignIn from '@/components/auth/SignIn';
import OrdersWidget from '@/components/orders/OrderWidget';

export default async function Home() {
  return (
    <main className="space-y-4">
      <div>
        <OrdersWidget />
      </div>
      <SignIn />
    </main>
  );
}
