'use client';

import CustomerAddressForm from '@/components/customerAddresses/CustomerAddressForm';
import CheckoutProducts from './checkout-products';

export default function Page() {
  return (
    <main className="grid grid-cols-2 divide-x min-h-[90vh]">
      <div className="p-8 space-y-4 flex flex-col mt-8">
        <div className="flex items-center justify-between">
          <p className="text-2xl">Contact</p>
        </div>
        <CustomerAddressForm />
      </div>
      <div className="p-8 space-y-4 flex flex-col mt-8">
        <CheckoutProducts />
      </div>
    </main>
  );
}
