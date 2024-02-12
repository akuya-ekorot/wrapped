import { type TImage } from '@/lib/db/schema/images';
import { type Collection } from '@/lib/db/schema/collections';
import {
  type CollectionImage,
  type CompleteCollectionImage,
} from '@/lib/db/schema/collectionImages';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (
  action: OptimisticAction<CompleteCollectionImage>,
) => void;

export const useOptimisticCollectionImages = (
  collectionImages: CompleteCollectionImage[],
  images: TImage[],
  collections: Collection[],
) => {
  const [optimisticCollectionImages, addOptimisticCollectionImage] =
    useOptimistic(
      collectionImages,
      (
        currentState: CompleteCollectionImage[],
        action: OptimisticAction<CollectionImage>,
      ): CompleteCollectionImage[] => {
        const { data } = action;

        const optimisticImage = images.find(
          (image) => image.id === data.imageId,
        )!;

        const optimisticCollection = collections.find(
          (collection) => collection.id === data.collectionId,
        )!;

        const optimisticCollectionImage = {
          ...data,
          image: optimisticImage,
          collection: optimisticCollection,
          id: 'optimistic',
        };

        switch (action.action) {
          case 'create':
            return currentState.length === 0
              ? [optimisticCollectionImage]
              : [...currentState, optimisticCollectionImage];
          case 'update':
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticCollectionImage }
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

  return { addOptimisticCollectionImage, optimisticCollectionImages };
};
