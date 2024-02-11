import {
  type DeliveryZone,
  type CompleteDeliveryZone,
} from '@/lib/db/schema/deliveryZones';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<DeliveryZone>) => void;

export const useOptimisticDeliveryZones = (
  deliveryZones: CompleteDeliveryZone[],
) => {
  const [optimisticDeliveryZones, addOptimisticDeliveryZone] = useOptimistic(
    deliveryZones,
    (
      currentState: CompleteDeliveryZone[],
      action: OptimisticAction<DeliveryZone>,
    ): CompleteDeliveryZone[] => {
      const { data } = action;

      const optimisticDeliveryZone = {
        ...data,

        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticDeliveryZone]
            : [...currentState, optimisticDeliveryZone];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticDeliveryZone } : item,
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

  return { addOptimisticDeliveryZone, optimisticDeliveryZones };
};
