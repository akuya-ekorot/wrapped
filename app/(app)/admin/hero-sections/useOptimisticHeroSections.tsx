import { type TImage } from '@/lib/db/schema/images';
import { type HomePage } from '@/lib/db/schema/homePages';
import {
  type HeroSection,
  type CompleteHeroSection,
} from '@/lib/db/schema/heroSections';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<HeroSection>) => void;

export const useOptimisticHeroSections = (
  heroSections: CompleteHeroSection[],
  images: TImage[],
  homePages: HomePage[],
) => {
  const [optimisticHeroSections, addOptimisticHeroSection] = useOptimistic(
    heroSections,
    (
      currentState: CompleteHeroSection[],
      action: OptimisticAction<HeroSection>,
    ): CompleteHeroSection[] => {
      const { data } = action;

      const optimisticImage = images.find(
        (image) => image.id === data.imageId,
      )!;

      const optimisticHomePage = homePages.find(
        (homePage) => homePage.id === data.homePageId,
      )!;

      const optimisticHeroSection = {
        ...data,
        image: optimisticImage,
        homePage: optimisticHomePage,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticHeroSection]
            : [...currentState, optimisticHeroSection];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticHeroSection } : item,
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

  return { addOptimisticHeroSection, optimisticHeroSections };
};
