import Filters from '@/components/admin-home/filters';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPercentageChange, getTotals } from '@/lib/api/orders/queries';
import { AllStatus, OrderStatus, TOrderStatus } from '@/lib/db/schema/orders';
import { ArrowDown, ArrowUp, Infinity as InfinityIcon } from 'lucide-react';
import { DateTime } from 'luxon';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { start, end, status } = searchParams;

  let startDuration: Date | undefined = undefined;
  let endDuration: Date | undefined = undefined;
  let statusFilter: OrderStatus | AllStatus;

  if (status instanceof Array) {
    statusFilter = status[0] as OrderStatus | AllStatus;
  } else {
    statusFilter = (status as OrderStatus | AllStatus) ?? AllStatus.All;
  }

  if (start instanceof Array) {
    startDuration = DateTime.fromISO(start[0]).toJSDate();
  } else if (start) {
    startDuration = DateTime.fromISO(start).toJSDate();
  }

  if (end instanceof Array) {
    endDuration = DateTime.fromISO(end[0]).toJSDate();
  } else if (end) {
    endDuration = DateTime.fromISO(end).toJSDate();
  }

  const { totalOrderRevenue, totalOrderCount, totalCustomerCount } =
    await getTotals({
      start: startDuration,
      end: endDuration,
      status: statusFilter,
    });

  const {
    revenuePercentageChange,
    orderPercentageChange,
    customerPercentageChange,
  } = await getPercentageChange({
    start: startDuration,
    end: endDuration,
    status: statusFilter,
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

  const percentageChangeValue =
    !percentageChange || percentageChange == 0
      ? 0
      : Math.abs(Math.round(percentageChange * 100) / 100);

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
                <span className="flex items-center">
                  {percentageChangeValue === Infinity ? (
                    <InfinityIcon />
                  ) : (
                    percentageChangeValue
                  )}
                  %
                </span>
                <InfinityIcon />
              </div>
            ) : (
              <div className="text-primary flex items-center gap-2">
                <ArrowUp />
                <span className="flex items-center">
                  {percentageChangeValue === Infinity ? (
                    <InfinityIcon />
                  ) : (
                    percentageChangeValue
                  )}
                  %
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
  const percentageChangeValue =
    !percentageChange || percentageChange == 0
      ? 0
      : Math.abs(Math.round(percentageChange * 100) / 100);

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

                <span className="flex items-center">
                  {percentageChangeValue === Infinity ? (
                    <InfinityIcon />
                  ) : (
                    percentageChangeValue
                  )}
                  %
                </span>
              </div>
            ) : (
              <div className="text-primary flex items-center gap-2">
                <ArrowUp />
                <span className="flex items-center">
                  {percentageChangeValue === Infinity ? (
                    <InfinityIcon />
                  ) : (
                    percentageChangeValue
                  )}
                  %
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
  const percentageChangeValue =
    !percentageChange || percentageChange == 0
      ? 0
      : Math.abs(Math.round(percentageChange * 100) / 100);
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
                <span className="flex items-center">
                  {percentageChangeValue === Infinity ? (
                    <InfinityIcon />
                  ) : (
                    percentageChangeValue
                  )}
                  %
                </span>
              </div>
            ) : (
              <div className="text-primary flex items-center gap-2">
                <ArrowUp />
                <span className="flex items-center">
                  {percentageChangeValue === Infinity ? (
                    <InfinityIcon />
                  ) : (
                    percentageChangeValue
                  )}
                  %
                </span>
              </div>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
