import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { CompleteOrderItem } from '@/lib/db/schema/orderItems';
import { Product } from '@/lib/db/schema/products';
import { Variant } from '@/lib/db/schema/variants';

export default function OrderItemInfoList({
  orderItem,
  product,
  variant,
}: {
  orderItem: CompleteOrderItem;
  product?: Product;
  variant?: Variant;
}) {
  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{orderItem.quantity}</CardTitle>
        </CardHeader>
        <CardContent>Quantity</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{formatter.format(orderItem.amount)}</CardTitle>
        </CardHeader>
        <CardContent>Amount</CardContent>
      </Card>
      {orderItem.productId && product && (
        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>Product</CardContent>
        </Card>
      )}
      {orderItem.variantId && variant && (
        <Card>
          <CardHeader>
            <CardTitle>{variant.name}</CardTitle>
          </CardHeader>
          <CardContent>Product Variant</CardContent>
        </Card>
      )}
    </div>
  );
}
