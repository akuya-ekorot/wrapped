import { type DeliveryZone } from '@/lib/db/schema/deliveryZones';
import { type Order, type CompleteOrder } from '@/lib/db/schema/orders';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<Order>) => void;

export const useOptimisticOrders = (
  orders: CompleteOrder[],
  deliveryZones: DeliveryZone[],
) => {
  const [optimisticOrders, addOptimisticOrder] = useOptimistic(
    orders,
    (
      currentState: CompleteOrder[],
      action: OptimisticAction<Order>,
    ): CompleteOrder[] => {
      const { data } = action;

      const optimisticDeliveryZone = deliveryZones.find(
        (deliveryZone) => deliveryZone.id === data.deliveryZoneId,
      )!;

      const optimisticOrder = {
        ...data,
        deliveryZone: optimisticDeliveryZone,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticOrder]
            : [...currentState, optimisticOrder];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticOrder } : item,
          );
        case 'delete':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: 'delete' } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticOrder, optimisticOrders };
};
