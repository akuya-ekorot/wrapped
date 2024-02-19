import { db } from '@/lib/db/index';
import { eq, and, ne } from 'drizzle-orm';
import {
  VariantOptionId,
  NewVariantOptionParams,
  UpdateVariantOptionParams,
  updateVariantOptionSchema,
  insertVariantOptionSchema,
  variantOptions,
  variantOptionIdSchema,
} from '@/lib/db/schema/variantOptions';
import { variants } from '@/lib/db/schema/variants';
import { z } from 'zod';

const productHasDuplicateVariantOptions = async (
  newVariantOption: z.infer<typeof insertVariantOptionSchema>,
) => {
  // get all variant options of the current variant.
  const variantOptionsForCurrentVariant = await db
    .select()
    .from(variantOptions)
    .where(eq(variantOptions.variantId, newVariantOption.variantId));

  // merge the new variant option with the existing ones.
  const currentOptions = [...variantOptionsForCurrentVariant, newVariantOption];

  // get all the variant options for all variants of the current product.
  const allOtherVariantOptionsForProduct = await db
    .select({ variantOption: variantOptions, variant: variants })
    .from(variantOptions)
    .where(
      and(
        eq(variantOptions.productId, newVariantOption.productId),
        ne(variantOptions.variantId, newVariantOption.variantId),
        // eq(variants.isComplete, true),
      ),
    )
    .leftJoin(variants, eq(variants.id, variantOptions.variantId));

  // generate a key for the option and optionValue.
  const generateOptionKey = (optionId: string, optionValueId: string) =>
    `${optionId}-${optionValueId}`;

  const hasDuplicate = ({
    allOtherVariantOptionsForProduct,
    currentOptions,
  }: {
    allOtherVariantOptionsForProduct: any[];
    currentOptions: any[];
  }) => {
    if (allOtherVariantOptionsForProduct.length === 0) return false;

    const currentOptionsSet = new Set(
      currentOptions.map((vo) =>
        generateOptionKey(vo.optionId, vo.optionValueId),
      ),
    );

    return allOtherVariantOptionsForProduct.some((vo) => {
      const newKey = generateOptionKey(
        vo.variantOption.optionId,
        vo.variantOption.optionValueId,
      );

      return currentOptionsSet.has(newKey);
    });
  };

  const has = hasDuplicate({
    allOtherVariantOptionsForProduct,
    currentOptions,
  });

  return has;
};

export const createVariantOption = async (
  variantOption: NewVariantOptionParams,
) => {
  const newVariantOption = insertVariantOptionSchema.parse(variantOption);

  try {
    if (await productHasDuplicateVariantOptions(newVariantOption)) {
      throw new Error(
        'The combination of variant options already exists for this product',
      );
    }

    const [v] = await db
      .insert(variantOptions)
      .values(newVariantOption)
      .returning();
    return { variantOption: v };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateVariantOption = async (
  id: VariantOptionId,
  variantOption: UpdateVariantOptionParams,
) => {
  const { id: variantOptionId } = variantOptionIdSchema.parse({ id });
  const newVariantOption = updateVariantOptionSchema.parse(variantOption);

  // get all variant options of the current variant.
  const variantOptionsForVariant = await db
    .select()
    .from(variantOptions)
    .where(eq(variantOptions.variantId, newVariantOption.variantId));

  // get all the variant options for all variants of the current product.
  const allOtherVariantOptionsForProduct = await db
    .select()
    .from(variantOptions)
    .where(
      and(
        eq(variantOptions.productId, newVariantOption.productId),
        ne(variantOptions.variantId, newVariantOption.variantId),
        eq(variants.isComplete, true),
      ),
    )
    .leftJoin(variants, eq(variants.id, variantOptions.variantId));

  const generateOptionKey = (optionId: string, optionValueId: string) =>
    `${optionId}-${optionValueId}`;

  const hasDuplicate = ({
    allOtherVariantOptionsForProduct,
    variantOptionsForVariant,
  }: {
    allOtherVariantOptionsForProduct: any[];
    variantOptionsForVariant: any[];
  }) => {
    const currentOptionsSet = new Set(
      variantOptionsForVariant.map((vo) =>
        generateOptionKey(vo.optionId, vo.optionValueId),
      ),
    );

    return allOtherVariantOptionsForProduct.some((vo) =>
      currentOptionsSet.has(generateOptionKey(vo.optionId, vo.optionValueId)),
    );
  };

  console.log(
    hasDuplicate({
      allOtherVariantOptionsForProduct,
      variantOptionsForVariant,
    }),
  );

  try {
    const [v] = await db
      .update(variantOptions)
      .set({ ...newVariantOption, updatedAt: new Date() })
      .where(eq(variantOptions.id, variantOptionId!))
      .returning();
    return { variantOption: v };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteVariantOption = async (id: VariantOptionId) => {
  const { id: variantOptionId } = variantOptionIdSchema.parse({ id });
  try {
    const [v] = await db
      .delete(variantOptions)
      .where(eq(variantOptions.id, variantOptionId!))
      .returning();
    return { variantOption: v };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
