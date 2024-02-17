import { type Product } from '@/lib/db/schema/products';
import { type FeaturedProductsSection } from '@/lib/db/schema/featuredProductsSection';
import {
  type ReferredProduct,
  type CompleteReferredProduct,
} from '@/lib/db/schema/referredProducts';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (
  action: OptimisticAction<ReferredProduct>,
) => void;

export const useOptimisticReferredProducts = (
  referredProducts: CompleteReferredProduct[],
  products: Product[],
  featuredProductsSection: FeaturedProductsSection[],
) => {
  const [optimisticReferredProducts, addOptimisticReferredProduct] =
    useOptimistic(
      referredProducts,
      (
        currentState: CompleteReferredProduct[],
        action: OptimisticAction<ReferredProduct>,
      ): CompleteReferredProduct[] => {
        const { data } = action;

        const optimisticProduct = products.find(
          (product) => product.id === data.productId,
        )!;

        const optimisticFeaturedProductsSection = featuredProductsSection.find(
          (featuredProductsSection) =>
            featuredProductsSection.id === data.featuredProductsSectionId,
        )!;

        const optimisticReferredProduct = {
          ...data,
          product: optimisticProduct,
          featuredProductsSection: optimisticFeaturedProductsSection,
          id: 'optimistic',
        };

        switch (action.action) {
          case 'create':
            return currentState.length === 0
              ? [optimisticReferredProduct]
              : [...currentState, optimisticReferredProduct];
          case 'update':
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticReferredProduct }
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

  return { addOptimisticReferredProduct, optimisticReferredProducts };
};
