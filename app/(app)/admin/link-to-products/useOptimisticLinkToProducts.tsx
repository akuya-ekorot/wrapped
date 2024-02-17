import { type Product } from '@/lib/db/schema/products';
import { type PageLink } from '@/lib/db/schema/pageLinks';
import {
  type LinkToProduct,
  type CompleteLinkToProduct,
} from '@/lib/db/schema/linkToProducts';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<LinkToProduct>) => void;

export const useOptimisticLinkToProducts = (
  linkToProducts: CompleteLinkToProduct[],
  products: Product[],
  pageLinks: PageLink[],
) => {
  const [optimisticLinkToProducts, addOptimisticLinkToProduct] = useOptimistic(
    linkToProducts,
    (
      currentState: CompleteLinkToProduct[],
      action: OptimisticAction<LinkToProduct>,
    ): CompleteLinkToProduct[] => {
      const { data } = action;

      const optimisticProduct = products.find(
        (product) => product.id === data.productId,
      )!;

      const optimisticPageLink = pageLinks.find(
        (pageLink) => pageLink.id === data.pageLinkId,
      )!;

      const optimisticLinkToProduct = {
        ...data,
        product: optimisticProduct,
        pageLink: optimisticPageLink,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticLinkToProduct]
            : [...currentState, optimisticLinkToProduct];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id
              ? { ...item, ...optimisticLinkToProduct }
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

  return { addOptimisticLinkToProduct, optimisticLinkToProducts };
};
