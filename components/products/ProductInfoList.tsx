import { Product, ProductStatus } from '@/lib/db/schema/products';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function ProductInfoList({ product }: { product: Product }) {
  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>Name</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{product.slug}</CardTitle>
        </CardHeader>
        <CardContent>Slug</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">
            {
              Object.entries(ProductStatus).find(
                ([_, value]) => value === product.status,
              )![0]
            }
          </CardTitle>
        </CardHeader>
        <CardContent>Status</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">
            {formatter.format(product.price)}
          </CardTitle>
        </CardHeader>
        <CardContent>Price</CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="space-y-2">{'Description'}</CardTitle>
        </CardHeader>
        <CardContent>{product.description}</CardContent>
      </Card>
    </div>
  );
}
