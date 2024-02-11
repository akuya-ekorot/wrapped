import { type Option } from "@/lib/db/schema/options";
import { type OptionValue } from "@/lib/db/schema/optionValues";
import { type Variant } from "@/lib/db/schema/variants";
import { type VariantOption, type CompleteVariantOption } from "@/lib/db/schema/variantOptions";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<VariantOption>) => void;

export const useOptimisticVariantOptions = (
  variantOptions: CompleteVariantOption[],
  options: Option[],
  optionValues: OptionValue[],
  variants: Variant[]
) => {
  const [optimisticVariantOptions, addOptimisticVariantOption] = useOptimistic(
    variantOptions,
    (
      currentState: CompleteVariantOption[],
      action: OptimisticAction<VariantOption>,
    ): CompleteVariantOption[] => {
      const { data } = action;

      const optimisticOption = options.find(
        (option) => option.id === data.optionId,
      )!;

      const optimisticOptionValue = optionValues.find(
        (optionValue) => optionValue.id === data.optionValueId,
      )!;

      const optimisticVariant = variants.find(
        (variant) => variant.id === data.variantId,
      )!;

      const optimisticVariantOption = {
        ...data,
        option: optimisticOption,
       optionValue: optimisticOptionValue,
       variant: optimisticVariant,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticVariantOption]
            : [...currentState, optimisticVariantOption];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticVariantOption } : item,
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

  return { addOptimisticVariantOption, optimisticVariantOptions };
};
