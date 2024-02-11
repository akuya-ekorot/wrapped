import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type VariantOptionId,
  variantOptionIdSchema,
  variantOptions,
} from '@/lib/db/schema/variantOptions';
import { options } from '@/lib/db/schema/options';
import { optionValues } from '@/lib/db/schema/optionValues';
import { variants } from '@/lib/db/schema/variants';

export const getVariantOptions = async () => {
  const rows = await db
    .select({
      variantOption: variantOptions,
      option: options,
      optionValue: optionValues,
      variant: variants,
    })
    .from(variantOptions)
    .leftJoin(options, eq(variantOptions.optionId, options.id))
    .leftJoin(optionValues, eq(variantOptions.optionValueId, optionValues.id))
    .leftJoin(variants, eq(variantOptions.variantId, variants.id));
  const v = rows.map((r) => ({
    ...r.variantOption,
    option: r.option,
    optionValue: r.optionValue,
    variant: r.variant,
  }));
  return { variantOptions: v };
};

export const getVariantOptionById = async (id: VariantOptionId) => {
  const { id: variantOptionId } = variantOptionIdSchema.parse({ id });
  const [row] = await db
    .select({
      variantOption: variantOptions,
      option: options,
      optionValue: optionValues,
      variant: variants,
    })
    .from(variantOptions)
    .where(eq(variantOptions.id, variantOptionId))
    .leftJoin(options, eq(variantOptions.optionId, options.id))
    .leftJoin(optionValues, eq(variantOptions.optionValueId, optionValues.id))
    .leftJoin(variants, eq(variantOptions.variantId, variants.id));
  if (row === undefined) return {};
  const v = {
    ...row.variantOption,
    option: row.option,
    optionValue: row.optionValue,
    variant: row.variant,
  };
  return { variantOption: v };
};
