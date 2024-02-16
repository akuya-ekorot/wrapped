"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/customer-addresses/useOptimisticCustomerAddresses";
import { type CustomerAddress } from "@/lib/db/schema/customerAddresses";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CustomerAddressForm from "@/components/customerAddresses/CustomerAddressForm";
import { type DeliveryZone, type DeliveryZoneId } from "@/lib/db/schema/deliveryZones";

export default function OptimisticCustomerAddress({ 
  customerAddress,
  deliveryZones,
  deliveryZoneId 
}: { 
  customerAddress: CustomerAddress; 
  
  deliveryZones: DeliveryZone[];
  deliveryZoneId?: DeliveryZoneId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: CustomerAddress) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCustomerAddress, setOptimisticCustomerAddress] = useOptimistic(customerAddress);
  const updateCustomerAddress: TAddOptimistic = (input) =>
    setOptimisticCustomerAddress({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CustomerAddressForm
          customerAddress={optimisticCustomerAddress}
          deliveryZones={deliveryZones}
        deliveryZoneId={deliveryZoneId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateCustomerAddress}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticCustomerAddress.country}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticCustomerAddress.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticCustomerAddress, null, 2)}
      </pre>
    </div>
  );
}
