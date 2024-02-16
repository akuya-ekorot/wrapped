import { type DeliveryZone } from "@/lib/db/schema/deliveryZones";
import { type CustomerAddress, type CompleteCustomerAddress } from "@/lib/db/schema/customerAddresses";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<CustomerAddress>) => void;

export const useOptimisticCustomerAddresses = (
  customerAddresses: CompleteCustomerAddress[],
  deliveryZones: DeliveryZone[]
) => {
  const [optimisticCustomerAddresses, addOptimisticCustomerAddress] = useOptimistic(
    customerAddresses,
    (
      currentState: CompleteCustomerAddress[],
      action: OptimisticAction<CustomerAddress>,
    ): CompleteCustomerAddress[] => {
      const { data } = action;

      const optimisticDeliveryZone = deliveryZones.find(
        (deliveryZone) => deliveryZone.id === data.deliveryZoneId,
      )!;

      const optimisticCustomerAddress = {
        ...data,
        deliveryZone: optimisticDeliveryZone,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticCustomerAddress]
            : [...currentState, optimisticCustomerAddress];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticCustomerAddress } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticCustomerAddress, optimisticCustomerAddresses };
};
