import SignIn from '@/components/auth/SignIn';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTotalOrderRevenue } from '@/lib/api/orders/queries';

export default async function Home() {
  const { totalRevenue } = await getTotalOrderRevenue();

  return (
    <main className="space-y-4">
      <div>
        <TotalRevenueWidget totalRevenue={parseFloat(totalRevenue ?? '0')} />
      </div>
      <SignIn />
    </main>
  );
}

function TotalRevenueWidget({ totalRevenue }: { totalRevenue: number }) {
  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>Includes all revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex items-center justify-between">
          <p className="text-4xl font-semibold">
            {formatter.format(totalRevenue)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
