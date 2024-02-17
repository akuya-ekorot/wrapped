import { type TImage } from '@/lib/db/schema/images';
import { type Collection } from '@/lib/db/schema/collections';
import { type HomePage } from '@/lib/db/schema/homePages';
import {
  type FeaturedCollectionSection,
  type CompleteFeaturedCollectionSection,
} from '@/lib/db/schema/featuredCollectionSections';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (
  action: OptimisticAction<FeaturedCollectionSection>,
) => void;

export const useOptimisticFeaturedCollectionSections = (
  featuredCollectionSections: CompleteFeaturedCollectionSection[],
  images: TImage[],
  collections: Collection[],
  homePages: HomePage[],
) => {
  const [
    optimisticFeaturedCollectionSections,
    addOptimisticFeaturedCollectionSection,
  ] = useOptimistic(
    featuredCollectionSections,
    (
      currentState: CompleteFeaturedCollectionSection[],
      action: OptimisticAction<FeaturedCollectionSection>,
    ): CompleteFeaturedCollectionSection[] => {
      const { data } = action;

      const optimisticImage = images.find(
        (image) => image.id === data.imageId,
      )!;

      const optimisticCollection = collections.find(
        (collection) => collection.id === data.collectionId,
      )!;

      const optimisticHomePage = homePages.find(
        (homePage) => homePage.id === data.homePageId,
      )!;

      const optimisticFeaturedCollectionSection = {
        ...data,
        image: optimisticImage,
        collection: optimisticCollection,
        homePage: optimisticHomePage,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticFeaturedCollectionSection]
            : [...currentState, optimisticFeaturedCollectionSection];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id
              ? { ...item, ...optimisticFeaturedCollectionSection }
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

  return {
    addOptimisticFeaturedCollectionSection,
    optimisticFeaturedCollectionSections,
  };
};
