
import { type Tag, type CompleteTag } from "@/lib/db/schema/tags";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Tag>) => void;

export const useOptimisticTags = (
  tags: CompleteTag[],
  
) => {
  const [optimisticTags, addOptimisticTag] = useOptimistic(
    tags,
    (
      currentState: CompleteTag[],
      action: OptimisticAction<Tag>,
    ): CompleteTag[] => {
      const { data } = action;

      

      const optimisticTag = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticTag]
            : [...currentState, optimisticTag];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticTag } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticTag, optimisticTags };
};
