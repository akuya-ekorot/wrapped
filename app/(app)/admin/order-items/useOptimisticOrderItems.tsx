import { type Variant } from '@/lib/db/schema/variants';
import { type Order } from '@/lib/db/schema/orders';
import {
  type OrderItem,
  type CompleteOrderItem,
} from '@/lib/db/schema/orderItems';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<OrderItem>) => void;

export const useOptimisticOrderItems = (
  orderItems: CompleteOrderItem[],
  variants: Variant[],
  orders: Order[],
) => {
  const [optimisticOrderItems, addOptimisticOrderItem] = useOptimistic(
    orderItems,
    (
      currentState: CompleteOrderItem[],
      action: OptimisticAction<OrderItem>,
    ): CompleteOrderItem[] => {
      const { data } = action;

      const optimisticVariant = variants.find(
        (variant) => variant.id === data.variantId,
      )!;

      const optimisticOrder = orders.find(
        (order) => order.id === data.orderId,
      )!;

      const optimisticOrderItem = {
        ...data,
        variant: optimisticVariant,
        order: optimisticOrder,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticOrderItem]
            : [...currentState, optimisticOrderItem];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticOrderItem } : item,
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

  return { addOptimisticOrderItem, optimisticOrderItems };
};
