import { type Product } from '@/lib/db/schema/products';
import { type Option, type CompleteOption } from '@/lib/db/schema/options';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<Option>) => void;

export const useOptimisticOptions = (
  options: CompleteOption[],
  products: Product[],
) => {
  const [optimisticOptions, addOptimisticOption] = useOptimistic(
    options,
    (
      currentState: CompleteOption[],
      action: OptimisticAction<Option>,
    ): CompleteOption[] => {
      const { data } = action;

      const optimisticProduct = products.find(
        (product) => product.id === data.productId,
      )!;

      const optimisticOption = {
        ...data,
        product: optimisticProduct,
        optionValues: [],
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticOption]
            : [...currentState, optimisticOption];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticOption } : item,
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

  return { addOptimisticOption, optimisticOptions };
};
