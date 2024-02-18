import { getOrdersTotal } from '@/lib/api/orders/queries';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default async function OrdersWidget() {
  const { total, numOrders } = await getOrdersTotal();

  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-16">
          <div>
            <p className="text-sm">Amount</p>
            <p className="text-2xl font-semibold">{formatter.format(total)}</p>
          </div>
          <div>
            <p className="text-sm">No. of Orders</p>
            <p className="text-2xl font-semibold">{numOrders}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
