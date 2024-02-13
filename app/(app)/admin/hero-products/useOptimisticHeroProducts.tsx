import { type Product } from '@/lib/db/schema/products';
import { type HeroLink } from '@/lib/db/schema/heroLinks';
import {
  type HeroProduct,
  type CompleteHeroProduct,
} from '@/lib/db/schema/heroProducts';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<HeroProduct>) => void;

export const useOptimisticHeroProducts = (
  heroProducts: CompleteHeroProduct[],
  products: Product[],
  heroLinks: HeroLink[],
) => {
  const [optimisticHeroProducts, addOptimisticHeroProduct] = useOptimistic(
    heroProducts,
    (
      currentState: CompleteHeroProduct[],
      action: OptimisticAction<HeroProduct>,
    ): CompleteHeroProduct[] => {
      const { data } = action;

      const optimisticProduct = products.find(
        (product) => product.id === data.productId,
      )!;

      const optimisticHeroLink = heroLinks.find(
        (heroLink) => heroLink.id === data.heroLinkId,
      )!;

      const optimisticHeroProduct = {
        ...data,
        product: optimisticProduct,
        heroLink: optimisticHeroLink,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticHeroProduct]
            : [...currentState, optimisticHeroProduct];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticHeroProduct } : item,
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

  return { addOptimisticHeroProduct, optimisticHeroProducts };
};
