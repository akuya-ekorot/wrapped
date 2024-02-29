import Filters from '@/components/admin-home/filters';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPercentageChange, getTotals } from '@/lib/api/orders/queries';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { DateTime } from 'luxon';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { totalOrderRevenue, totalOrderCount, totalCustomerCount } =
    await getTotals({
      start: DateTime.now().startOf('day').toJSDate(),
      end: DateTime.now().endOf('day').toJSDate(),
    });

  const {
    revenuePercentageChange,
    orderPercentageChange,
    customerPercentageChange,
  } = await getPercentageChange({
    start: DateTime.now().startOf('day').toJSDate(),
    end: DateTime.now().endOf('day').toJSDate(),
  });

  return (
    <main className="space-y-8">
      <Filters />
      <div className="grid grid-cols-3 gap-4">
        <TotalRevenueWidget
          percentageChange={revenuePercentageChange}
          totalRevenue={parseFloat(totalOrderRevenue ?? '0')}
        />
        <TotalOrderCountWidget
          percentageChange={orderPercentageChange}
          totalOrderCount={totalOrderCount ?? 0}
        />
        <TotalCustomerCountWidget
          percentageChange={customerPercentageChange}
          totalCustomerCount={totalCustomerCount ?? 0}
        />
      </div>
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
          <p className="text-2xl font-semibold">
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

function TotalOrderCountWidget({
  totalOrderCount,
  percentageChange,
}: {
  totalOrderCount: number;
  percentageChange: number | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Orders</CardTitle>
        <CardDescription>Includes all orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex items-center justify-between">
          <p className="text-2xl font-semibold">{totalOrderCount}</p>
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

function TotalCustomerCountWidget({
  totalCustomerCount,
  percentageChange,
}: {
  totalCustomerCount: number;
  percentageChange: number | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Customers</CardTitle>
        <CardDescription>Includes all customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex items-center justify-between">
          <p className="text-2xl font-semibold">{totalCustomerCount}</p>
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
