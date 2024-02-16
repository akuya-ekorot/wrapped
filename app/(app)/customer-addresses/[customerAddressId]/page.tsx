import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCustomerAddressById } from "@/lib/api/customerAddresses/queries";
import { getDeliveryZones } from "@/lib/api/deliveryZones/queries";import OptimisticCustomerAddress from "./OptimisticCustomerAddress";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function CustomerAddressPage({
  params,
}: {
  params: { customerAddressId: string };
}) {

  return (
    <main className="overflow-auto">
      <CustomerAddress id={params.customerAddressId} />
    </main>
  );
}

const CustomerAddress = async ({ id }: { id: string }) => {
  await checkAuth();

  const { customerAddress } = await getCustomerAddressById(id);
  const { deliveryZones } = await getDeliveryZones();

  if (!customerAddress) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="customer-addresses" />
        <OptimisticCustomerAddress customerAddress={customerAddress} deliveryZones={deliveryZones} />
      </div>
    </Suspense>
  );
};
