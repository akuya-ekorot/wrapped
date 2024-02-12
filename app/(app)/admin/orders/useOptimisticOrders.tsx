import { type DeliveryZone } from '@/lib/db/schema/deliveryZones';
import { type Order, type CompleteOrder } from '@/lib/db/schema/orders';
import { Payment } from '@/lib/db/schema/payments';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<CompleteOrder>) => void;

export const useOptimisticOrders = (
  orders: CompleteOrder[],
  deliveryZones: DeliveryZone[],
  payments: Payment[],
) => {
  const [optimisticOrders, addOptimisticOrder] = useOptimistic(
    orders,
    (
      currentState: CompleteOrder[],
      action: OptimisticAction<CompleteOrder>,
    ): CompleteOrder[] => {
      const { data } = action;

      const optimisticDeliveryZone = deliveryZones.find(
        (deliveryZone) => deliveryZone.id === data.deliveryZoneId,
      )!;

      const optimisticPayment = payments.find(
        (payment) => payment.id === data.paymentId,
      )!;

      const optimisticOrder = {
        ...data,
        deliveryZone: optimisticDeliveryZone,
        payment: optimisticPayment,
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
