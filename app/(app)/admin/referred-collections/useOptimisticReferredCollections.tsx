import { type Collection } from '@/lib/db/schema/collections';
import { type MainCollection } from '@/lib/db/schema/mainCollections';
import {
  type ReferredCollection,
  type CompleteReferredCollection,
} from '@/lib/db/schema/referredCollections';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (
  action: OptimisticAction<ReferredCollection>,
) => void;

export const useOptimisticReferredCollections = (
  referredCollections: CompleteReferredCollection[],
  collections: Collection[],
  mainCollections: MainCollection[],
) => {
  const [optimisticReferredCollections, addOptimisticReferredCollection] =
    useOptimistic(
      referredCollections,
      (
        currentState: CompleteReferredCollection[],
        action: OptimisticAction<ReferredCollection>,
      ): CompleteReferredCollection[] => {
        const { data } = action;

        const optimisticCollection = collections.find(
          (collection) => collection.id === data.collectionId,
        )!;

        const optimisticMainCollection = mainCollections.find(
          (mainCollection) => mainCollection.id === data.mainCollectionId,
        )!;

        const optimisticReferredCollection = {
          ...data,
          collection: optimisticCollection,
          mainCollection: optimisticMainCollection,
          id: 'optimistic',
        };

        switch (action.action) {
          case 'create':
            return currentState.length === 0
              ? [optimisticReferredCollection]
              : [...currentState, optimisticReferredCollection];
          case 'update':
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticReferredCollection }
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

  return { addOptimisticReferredCollection, optimisticReferredCollections };
};
