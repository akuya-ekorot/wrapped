import SignIn from '@/components/auth/SignIn';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  getPercentageChange,
  getTotalOrderRevenue,
} from '@/lib/api/orders/queries';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { DateTime } from 'luxon';

export default async function Home() {
  const { totalRevenue } = await getTotalOrderRevenue({
    start: DateTime.now().startOf('day').toJSDate(),
    end: DateTime.now().endOf('day').toJSDate(),
  });

  const { percentageChange } = await getPercentageChange({
    start: DateTime.now().startOf('day').toJSDate(),
    end: DateTime.now().endOf('day').toJSDate(),
  });

  return (
    <main className="space-y-4">
      <div className="grid grid-cols-2">
        <TotalRevenueWidget
          percentageChange={percentageChange}
          totalRevenue={parseFloat(totalRevenue ?? '0')}
        />
      </div>
      <SignIn />
    </main>
  );
}

function TotalRevenueWidget({
  totalRevenue,
  percentageChange,
}: {
  totalRevenue: number;
  percentageChange: number | null;
}) {
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
          <p className="text-3xl font-semibold">
            {formatter.format(totalRevenue)}
          </p>
          <p className="text-muted-foreground text-sm">
            {!percentageChange || percentageChange === 0 ? (
              <span>Same as previous period</span>
            ) : percentageChange < 0 ? (
              <div className="text-destructive flex items-center gap-2">
                <ArrowDown />
                <span>
                  {`${Math.abs(Math.round(percentageChange * 100) / 100)}%`}
                </span>
              </div>
            ) : (
              <div className="text-primary flex items-center gap-2">
                <ArrowUp />
                <span>
                  {`${Math.abs(Math.round(percentageChange * 100) / 100)}%`}
                </span>
              </div>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
