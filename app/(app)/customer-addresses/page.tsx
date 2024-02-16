import { Suspense } from "react";

import Loading from "@/app/loading";
import CustomerAddressList from "@/components/customerAddresses/CustomerAddressList";
import { getCustomerAddresses } from "@/lib/api/customerAddresses/queries";
import { getDeliveryZones } from "@/lib/api/deliveryZones/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function CustomerAddressesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Customer Addresses</h1>
        </div>
        <CustomerAddresses />
      </div>
    </main>
  );
}

const CustomerAddresses = async () => {
  await checkAuth();

  const { customerAddresses } = await getCustomerAddresses();
  const { deliveryZones } = await getDeliveryZones();
  return (
    <Suspense fallback={<Loading />}>
      <CustomerAddressList customerAddresses={customerAddresses} deliveryZones={deliveryZones} />
    </Suspense>
  );
};
