import { type Variant } from '@/lib/db/schema/variants';
import { type Order } from '@/lib/db/schema/orders';
import {
  type OrderItem,
  type CompleteOrderItem,
} from '@/lib/db/schema/orderItems';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';
import { Product } from '@/lib/db/schema/products';

export type TAddOptimistic = (
  action: OptimisticAction<CompleteOrderItem>,
) => void;

export const useOptimisticOrderItems = (
  orderItems: CompleteOrderItem[],
  variants: Variant[],
  products: Product[],
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

      const optimisticProduct = products.find(
        (product) => product.id === data.productId,
      )!;

      const optimisticOrder = orders.find(
        (order) => order.id === data.orderId,
      )!;

      const optimisticOrderItem = {
        ...data,
        variant: optimisticVariant,
        product: optimisticProduct,
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
