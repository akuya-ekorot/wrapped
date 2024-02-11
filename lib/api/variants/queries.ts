import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type VariantId, variantIdSchema, variants } from "@/lib/db/schema/variants";
import { products } from "@/lib/db/schema/products";
import { variantOptions, type CompleteVariantOption } from "@/lib/db/schema/variantOptions";

export const getVariants = async () => {
  const rows = await db.select({ variant: variants, product: products }).from(variants).leftJoin(products, eq(variants.productId, products.id));
  const v = rows .map((r) => ({ ...r.variant, product: r.product})); 
  return { variants: v };
};

export const getVariantById = async (id: VariantId) => {
  const { id: variantId } = variantIdSchema.parse({ id });
  const [row] = await db.select({ variant: variants, product: products }).from(variants).where(eq(variants.id, variantId)).leftJoin(products, eq(variants.productId, products.id));
  if (row === undefined) return {};
  const v =  { ...row.variant, product: row.product } ;
  return { variant: v };
};

export const getVariantByIdWithVariantOptions = async (id: VariantId) => {
  const { id: variantId } = variantIdSchema.parse({ id });
  const rows = await db.select({ variant: variants, variantOption: variantOptions }).from(variants).where(eq(variants.id, variantId)).leftJoin(variantOptions, eq(variants.id, variantOptions.variantId));
  if (rows.length === 0) return {};
  const v = rows[0].variant;
  const vv = rows.filter((r) => r.variantOption !== null).map((v) => v.variantOption) as CompleteVariantOption[];

  return { variant: v, variantOptions: vv };
};

