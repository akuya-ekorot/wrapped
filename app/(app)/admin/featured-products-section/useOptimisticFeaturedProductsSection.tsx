import { type HomePage } from '@/lib/db/schema/homePages';
import {
  type FeaturedProductsSection,
  type CompleteFeaturedProductsSection,
} from '@/lib/db/schema/featuredProductsSection';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (
  action: OptimisticAction<FeaturedProductsSection>,
) => void;

export const useOptimisticFeaturedProductsSections = (
  featuredProductsSection: CompleteFeaturedProductsSection[],
  homePages: HomePage[],
) => {
  const [
    optimisticFeaturedProductsSections,
    addOptimisticFeaturedProductsSection,
  ] = useOptimistic(
    featuredProductsSection,
    (
      currentState: CompleteFeaturedProductsSection[],
      action: OptimisticAction<FeaturedProductsSection>,
    ): CompleteFeaturedProductsSection[] => {
      const { data } = action;

      const optimisticHomePage = homePages.find(
        (homePage) => homePage.id === data.homePageId,
      )!;

      const optimisticFeaturedProductsSection = {
        ...data,
        homePage: optimisticHomePage,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticFeaturedProductsSection]
            : [...currentState, optimisticFeaturedProductsSection];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id
              ? { ...item, ...optimisticFeaturedProductsSection }
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
    addOptimisticFeaturedProductsSection,
    optimisticFeaturedProductsSections,
  };
};
