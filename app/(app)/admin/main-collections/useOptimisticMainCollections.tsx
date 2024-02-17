import { type HomePage } from '@/lib/db/schema/homePages';
import {
  type MainCollection,
  type CompleteMainCollection,
} from '@/lib/db/schema/mainCollections';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<MainCollection>) => void;

export const useOptimisticMainCollections = (
  mainCollections: CompleteMainCollection[],
  homePages: HomePage[],
) => {
  const [optimisticMainCollections, addOptimisticMainCollection] =
    useOptimistic(
      mainCollections,
      (
        currentState: CompleteMainCollection[],
        action: OptimisticAction<MainCollection>,
      ): CompleteMainCollection[] => {
        const { data } = action;

        const optimisticHomePage = homePages.find(
          (homePage) => homePage.id === data.homePageId,
        )!;

        const optimisticMainCollection = {
          ...data,
          homePage: optimisticHomePage,
          id: 'optimistic',
        };

        switch (action.action) {
          case 'create':
            return currentState.length === 0
              ? [optimisticMainCollection]
              : [...currentState, optimisticMainCollection];
          case 'update':
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticMainCollection }
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

  return { addOptimisticMainCollection, optimisticMainCollections };
};
