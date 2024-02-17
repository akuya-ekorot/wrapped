import { type Collection } from '@/lib/db/schema/collections';
import { type Product } from '@/lib/db/schema/products';
import {
  type ProductCollection,
  type CompleteProductCollection,
} from '@/lib/db/schema/productCollections';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (
  action: OptimisticAction<ProductCollection>,
) => void;

export const useOptimisticProductCollections = (
  productCollections: CompleteProductCollection[],
  collections: Collection[],
  products: Product[],
) => {
  const [optimisticProductCollections, addOptimisticProductCollection] =
    useOptimistic(
      productCollections,
      (
        currentState: CompleteProductCollection[],
        action: OptimisticAction<ProductCollection>,
      ): CompleteProductCollection[] => {
        const { data } = action;

        const optimisticCollection = collections.find(
          (collection) => collection.id === data.collectionId,
        )!;

        const optimisticProduct = products.find(
          (product) => product.id === data.productId,
        )!;

        const optimisticProductCollection = {
          ...data,
          collection: optimisticCollection,
          product: optimisticProduct,
          id: 'optimistic',
        };

        switch (action.action) {
          case 'create':
            return currentState.length === 0
              ? [optimisticProductCollection]
              : [...currentState, optimisticProductCollection];
          case 'update':
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticProductCollection }
                : item,
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

  return { addOptimisticProductCollection, optimisticProductCollections };
};
