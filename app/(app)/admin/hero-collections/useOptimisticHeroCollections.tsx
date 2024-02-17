import { type Collection } from '@/lib/db/schema/collections';
import { type HeroLink } from '@/lib/db/schema/heroLinks';
import {
  type HeroCollection,
  type CompleteHeroCollection,
} from '@/lib/db/schema/heroCollections';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<HeroCollection>) => void;

export const useOptimisticHeroCollections = (
  heroCollections: CompleteHeroCollection[],
  collections: Collection[],
  heroLinks: HeroLink[],
) => {
  const [optimisticHeroCollections, addOptimisticHeroCollection] =
    useOptimistic(
      heroCollections,
      (
        currentState: CompleteHeroCollection[],
        action: OptimisticAction<HeroCollection>,
      ): CompleteHeroCollection[] => {
        const { data } = action;

        const optimisticCollection = collections.find(
          (collection) => collection.id === data.collectionId,
        )!;

        const optimisticHeroLink = heroLinks.find(
          (heroLink) => heroLink.id === data.heroLinkId,
        )!;

        const optimisticHeroCollection = {
          ...data,
          collection: optimisticCollection,
          heroLink: optimisticHeroLink,
          id: 'optimistic',
        };

        switch (action.action) {
          case 'create':
            return currentState.length === 0
              ? [optimisticHeroCollection]
              : [...currentState, optimisticHeroCollection];
          case 'update':
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticHeroCollection }
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

  return { addOptimisticHeroCollection, optimisticHeroCollections };
};
