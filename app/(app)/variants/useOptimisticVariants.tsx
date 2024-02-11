import { type Product } from "@/lib/db/schema/products";
import { type Variant, type CompleteVariant } from "@/lib/db/schema/variants";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Variant>) => void;

export const useOptimisticVariants = (
  variants: CompleteVariant[],
  products: Product[]
) => {
  const [optimisticVariants, addOptimisticVariant] = useOptimistic(
    variants,
    (
      currentState: CompleteVariant[],
      action: OptimisticAction<Variant>,
    ): CompleteVariant[] => {
      const { data } = action;

      const optimisticProduct = products.find(
        (product) => product.id === data.productId,
      )!;

      const optimisticVariant = {
        ...data,
        product: optimisticProduct,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticVariant]
            : [...currentState, optimisticVariant];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticVariant } : item,
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

  return { addOptimisticVariant, optimisticVariants };
};
