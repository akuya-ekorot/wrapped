"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type CustomerAddress, CompleteCustomerAddress } from "@/lib/db/schema/customerAddresses";
import Modal from "@/components/shared/Modal";
import { type DeliveryZone, type DeliveryZoneId } from "@/lib/db/schema/deliveryZones";
import { useOptimisticCustomerAddresses } from "@/app/(app)/customer-addresses/useOptimisticCustomerAddresses";
import { Button } from "@/components/ui/button";
import CustomerAddressForm from "./CustomerAddressForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (customerAddress?: CustomerAddress) => void;

export default function CustomerAddressList({
  customerAddresses,
  deliveryZones,
  deliveryZoneId 
}: {
  customerAddresses: CompleteCustomerAddress[];
  deliveryZones: DeliveryZone[];
  deliveryZoneId?: DeliveryZoneId 
}) {
  const { optimisticCustomerAddresses, addOptimisticCustomerAddress } = useOptimisticCustomerAddresses(
    customerAddresses,
    deliveryZones 
  );
  const [open, setOpen] = useState(false);
  const [activeCustomerAddress, setActiveCustomerAddress] = useState<CustomerAddress | null>(null);
  const openModal = (customerAddress?: CustomerAddress) => {
    setOpen(true);
    customerAddress ? setActiveCustomerAddress(customerAddress) : setActiveCustomerAddress(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeCustomerAddress ? "Edit CustomerAddress" : "Create Customer Address"}
      >
        <CustomerAddressForm
          customerAddress={activeCustomerAddress}
          addOptimistic={addOptimisticCustomerAddress}
          openModal={openModal}
          closeModal={closeModal}
          deliveryZones={deliveryZones}
        deliveryZoneId={deliveryZoneId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticCustomerAddresses.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticCustomerAddresses.map((customerAddress) => (
            <CustomerAddress
              customerAddress={customerAddress}
              key={customerAddress.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const CustomerAddress = ({
  customerAddress,
  openModal,
}: {
  customerAddress: CompleteCustomerAddress;
  openModal: TOpenModal;
}) => {
  const optimistic = customerAddress.id === "optimistic";
  const deleting = customerAddress.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("customer-addresses")
    ? pathname
    : pathname + "/customer-addresses/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{customerAddress.country}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + customerAddress.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No customer addresses
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new customer address.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Customer Addresses </Button>
      </div>
    </div>
  );
};
