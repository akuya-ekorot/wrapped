import { CompleteOrder, OrderStatus, OrderType } from '@/lib/db/schema/orders';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Payment } from '@/lib/db/schema/payments';
import { Customer } from '@/lib/db/schema/customers';

export default function CustomerInfoList({ customer }: { customer: Customer }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{customer.name}</CardTitle>
        </CardHeader>
        <CardContent>Name</CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="">{customer.email}</CardTitle>
        </CardHeader>
        <CardContent>Email</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{customer.phone}</CardTitle>
        </CardHeader>
        <CardContent>Phone</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{customer.country}</CardTitle>
        </CardHeader>
        <CardContent>Country</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{customer.city}</CardTitle>
        </CardHeader>
        <CardContent>City</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{customer.address}</CardTitle>
        </CardHeader>
        <CardContent>Address</CardContent>
      </Card>
      {customer.extraDetails && (
        <Card className="">
          <CardHeader>
            <CardTitle className="space-y-2">{customer.extraDetails}</CardTitle>
          </CardHeader>
          <CardContent>extraDetails</CardContent>
        </Card>
      )}
      {customer.postalCode && (
        <Card className="">
          <CardHeader>
            <CardTitle className="space-y-2">{customer.postalCode}</CardTitle>
          </CardHeader>
          <CardContent>Postal Code</CardContent>
        </Card>
      )}
    </div>
  );
}
