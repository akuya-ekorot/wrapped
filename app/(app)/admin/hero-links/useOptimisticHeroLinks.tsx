import { type HeroSection } from '@/lib/db/schema/heroSections';
import {
  type HeroLink,
  type CompleteHeroLink,
} from '@/lib/db/schema/heroLinks';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<HeroLink>) => void;

export const useOptimisticHeroLinks = (
  heroLinks: CompleteHeroLink[],
  heroSections: HeroSection[],
) => {
  const [optimisticHeroLinks, addOptimisticHeroLink] = useOptimistic(
    heroLinks,
    (
      currentState: CompleteHeroLink[],
      action: OptimisticAction<HeroLink>,
    ): CompleteHeroLink[] => {
      const { data } = action;

      const optimisticHeroSection = heroSections.find(
        (heroSection) => heroSection.id === data.heroSectionId,
      )!;

      const optimisticHeroLink = {
        ...data,
        heroSection: optimisticHeroSection,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticHeroLink]
            : [...currentState, optimisticHeroLink];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticHeroLink } : item,
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

  return { addOptimisticHeroLink, optimisticHeroLinks };
};
