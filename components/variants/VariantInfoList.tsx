import { Product, ProductStatus } from '@/lib/db/schema/products';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Variant } from '@/lib/db/schema/variants';

export default function VariantInfoList({ variant }: { variant: Variant }) {
  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{variant.name}</CardTitle>
        </CardHeader>
        <CardContent>Name</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">
            {
              Object.entries(ProductStatus).find(
                ([_, value]) => value === variant.status,
              )![0]
            }
          </CardTitle>
        </CardHeader>
        <CardContent>Status</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">
            {formatter.format(variant.price ?? 0)}
          </CardTitle>
        </CardHeader>
        <CardContent>Price</CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="space-y-2">{'Description'}</CardTitle>
        </CardHeader>
        <CardContent>{variant.description}</CardContent>
      </Card>
    </div>
  );
}
