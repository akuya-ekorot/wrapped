import { type Tag } from '@/lib/db/schema/tags';
import { type Product } from '@/lib/db/schema/products';
import {
  type ProductTag,
  type CompleteProductTag,
} from '@/lib/db/schema/productTags';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<ProductTag>) => void;

export const useOptimisticProductTags = (
  productTags: CompleteProductTag[],
  tags: Tag[],
  products: Product[],
) => {
  const [optimisticProductTags, addOptimisticProductTag] = useOptimistic(
    productTags,
    (
      currentState: CompleteProductTag[],
      action: OptimisticAction<ProductTag>,
    ): CompleteProductTag[] => {
      const { data } = action;

      const optimisticTag = tags.find((tag) => tag.id === data.tagId)!;

      const optimisticProduct = products.find(
        (product) => product.id === data.productId,
      )!;

      const optimisticProductTag = {
        ...data,
        tag: optimisticTag,
        product: optimisticProduct,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticProductTag]
            : [...currentState, optimisticProductTag];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticProductTag } : item,
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

  return { addOptimisticProductTag, optimisticProductTags };
};
