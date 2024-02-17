import { type Collection } from '@/lib/db/schema/collections';
import { type PageLink } from '@/lib/db/schema/pageLinks';
import {
  type LinkToCollection,
  type CompleteLinkToCollection,
} from '@/lib/db/schema/linkToCollections';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (
  action: OptimisticAction<CompleteLinkToCollection>,
) => void;

export const useOptimisticLinkToCollections = (
  linkToCollections: CompleteLinkToCollection[],
  collections: Collection[],
  pageLinks: PageLink[],
) => {
  const [optimisticLinkToCollections, addOptimisticLinkToCollection] =
    useOptimistic(
      linkToCollections,
      (
        currentState: CompleteLinkToCollection[],
        action: OptimisticAction<LinkToCollection>,
      ): CompleteLinkToCollection[] => {
        const { data } = action;

        const optimisticCollection = collections.find(
          (collection) => collection.id === data.collectionId,
        )!;

        const optimisticPageLink = pageLinks.find(
          (pageLink) => pageLink.id === data.pageLinkId,
        )!;

        const optimisticLinkToCollection = {
          ...data,
          collection: optimisticCollection,
          pageLink: optimisticPageLink,
          id: 'optimistic',
        };

        switch (action.action) {
          case 'create':
            return currentState.length === 0
              ? [optimisticLinkToCollection]
              : [...currentState, optimisticLinkToCollection];
          case 'update':
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticLinkToCollection }
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

  return { addOptimisticLinkToCollection, optimisticLinkToCollections };
};
