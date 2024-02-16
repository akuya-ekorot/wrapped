import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type VariantId,
  variantIdSchema,
  variants,
} from '@/lib/db/schema/variants';
import { products } from '@/lib/db/schema/products';
import {
  variantOptions,
  type CompleteVariantOption,
} from '@/lib/db/schema/variantOptions';
import { options } from '@/lib/db/schema/options';
import { optionValues } from '@/lib/db/schema/optionValues';
import { variantImages } from '@/lib/db/schema/variantImages';
import { productImages } from '@/lib/db/schema/productImages';
import { images } from '@/lib/db/schema/images';

export const getCartVariants = async () => {
  const rows = await db
    .select({
      variant: variants,
      product: products,
      image: images,
      option: options,
    })
    .from(variants)
    .leftJoin(products, eq(variants.productId, products.id))
    .leftJoin(variantOptions, eq(variants.id, variantOptions.variantId))
    .leftJoin(options, eq(variantOptions.optionId, options.id))
    .leftJoin(variantImages, eq(variants.id, variantImages.variantId))
    .leftJoin(productImages, eq(productImages.id, variantImages.productImageId))
    .leftJoin(images, eq(productImages.imageId, images.id));

  const v = rows.map((r) => ({
    ...r.variant,
    product: r.product,
  }));

  return { variants: v };
};

export const getVariants = async () => {
  const rows = await db
    .select({ variant: variants, product: products })
    .from(variants)
    .leftJoin(products, eq(variants.productId, products.id));
  const v = rows.map((r) => ({ ...r.variant, product: r.product }));
  return { variants: v };
};

export const getVariantById = async (id: VariantId) => {
  const { id: variantId } = variantIdSchema.parse({ id });
  const [row] = await db
    .select({ variant: variants, product: products })
    .from(variants)
    .where(eq(variants.id, variantId))
    .leftJoin(products, eq(variants.productId, products.id));
  if (row === undefined) return {};
  const v = { ...row.variant, product: row.product };
  return { variant: v };
};

export const getVariantByIdWithVariantOptions = async (id: VariantId) => {
  const { id: variantId } = variantIdSchema.parse({ id });
  const rows = await db
    .select({
      variant: variants,
      variantOption: variantOptions,
      option: options,
      optionValue: optionValues,
    })
    .from(variants)
    .where(eq(variants.id, variantId))
    .leftJoin(variantOptions, eq(variants.id, variantOptions.variantId))
    .leftJoin(options, eq(variantOptions.optionId, options.id))
    .leftJoin(optionValues, eq(variantOptions.optionValueId, optionValues.id));

  if (rows.length === 0) return {};

  const v = rows[0].variant;

  const v_options = rows
    .filter((r) => r.variantOption !== null)
    .filter(
      (r, i, self) =>
        self.findIndex((s) => s.variantOption!.id === r.variantOption!.id) ===
        i,
    )
    .map((v) => ({
      ...v.variantOption,
      option: v.option,
      optionValue: v.optionValue,
    })) as CompleteVariantOption[];

  return {
    variant: v,
    variantOptions: v_options,
  };
};
