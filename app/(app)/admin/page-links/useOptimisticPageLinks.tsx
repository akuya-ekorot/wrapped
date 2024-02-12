import {
  type PageLink,
  type CompletePageLink,
} from '@/lib/db/schema/pageLinks';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<PageLink>) => void;

export const useOptimisticPageLinks = (pageLinks: CompletePageLink[]) => {
  const [optimisticPageLinks, addOptimisticPageLink] = useOptimistic(
    pageLinks,
    (
      currentState: CompletePageLink[],
      action: OptimisticAction<PageLink>,
    ): CompletePageLink[] => {
      const { data } = action;

      const optimisticPageLink = {
        ...data,

        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticPageLink]
            : [...currentState, optimisticPageLink];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticPageLink } : item,
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

  return { addOptimisticPageLink, optimisticPageLinks };
};
