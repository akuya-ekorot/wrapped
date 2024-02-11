import { type Option } from '@/lib/db/schema/options';
import {
  type OptionValue,
  type CompleteOptionValue,
} from '@/lib/db/schema/optionValues';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<OptionValue>) => void;

export const useOptimisticOptionValues = (
  optionValues: CompleteOptionValue[],
  options: Option[],
) => {
  const [optimisticOptionValues, addOptimisticOptionValue] = useOptimistic(
    optionValues,
    (
      currentState: CompleteOptionValue[],
      action: OptimisticAction<OptionValue>,
    ): CompleteOptionValue[] => {
      const { data } = action;

      const optimisticOption = options.find(
        (option) => option.id === data.optionId,
      )!;

      const optimisticOptionValue = {
        ...data,
        option: optimisticOption,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticOptionValue]
            : [...currentState, optimisticOptionValue];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticOptionValue } : item,
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

  return { addOptimisticOptionValue, optimisticOptionValues };
};
