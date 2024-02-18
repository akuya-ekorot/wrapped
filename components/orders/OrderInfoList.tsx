import { CompleteOrder, OrderStatus, OrderType } from '@/lib/db/schema/orders';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Payment } from '@/lib/db/schema/payments';
import { Customer } from '@/lib/db/schema/customers';

export default function OrderInfoList({
  customer,
  order,
  payment,
}: {
  order: CompleteOrder;
  payment: Payment['amount'];
  customer?: Customer;
}) {
  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="space-y-2">
            <p>{customer?.name}</p>
            <p>{customer?.email}</p>
            <p>{customer?.phone}</p>
          </CardTitle>
        </CardHeader>
        <CardContent>Customer Details</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {
              Object.entries(OrderStatus).find(
                ([_, value]) => value === order.status,
              )![0]
            }
          </CardTitle>
        </CardHeader>
        <CardContent>Status</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {
              Object.entries(OrderType).find(
                ([_, value]) => value === order.type,
              )![0]
            }
          </CardTitle>
        </CardHeader>
        <CardContent>Type</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {order.deliveryZone?.name ?? 'No Delivery Zone'}
          </CardTitle>
        </CardHeader>
        <CardContent>Delivery Zone</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{formatter.format(order.amount)}</CardTitle>
        </CardHeader>
        <CardContent>Amount Due</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{formatter.format(payment ?? 0)}</CardTitle>
        </CardHeader>
        <CardContent>Payment Made</CardContent>
      </Card>
      {order.notes && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>{order.notes}</CardTitle>
          </CardHeader>
          <CardContent>Order Notes</CardContent>
        </Card>
      )}
    </div>
  );
}
