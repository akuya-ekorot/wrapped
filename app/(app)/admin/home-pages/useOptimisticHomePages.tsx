import {
  type HomePage,
  type CompleteHomePage,
} from '@/lib/db/schema/homePages';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<HomePage>) => void;

export const useOptimisticHomePages = (homePages: CompleteHomePage[]) => {
  const [optimisticHomePages, addOptimisticHomePage] = useOptimistic(
    homePages,
    (
      currentState: CompleteHomePage[],
      action: OptimisticAction<HomePage>,
    ): CompleteHomePage[] => {
      const { data } = action;

      const optimisticHomePage = {
        ...data,

        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticHomePage]
            : [...currentState, optimisticHomePage];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticHomePage } : item,
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

  return { addOptimisticHomePage, optimisticHomePages };
};
