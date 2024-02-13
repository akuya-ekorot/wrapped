import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type ReferredProductId,
  referredProductIdSchema,
  referredProducts,
} from '@/lib/db/schema/referredProducts';
import { products } from '@/lib/db/schema/products';
import { featuredProductsSection } from '@/lib/db/schema/featuredProductsSection';

export const getReferredProducts = async () => {
  const rows = await db
    .select({
      referredProduct: referredProducts,
      product: products,
      featuredProductsSection: featuredProductsSection,
    })
    .from(referredProducts)
    .leftJoin(products, eq(referredProducts.productId, products.id))
    .leftJoin(
      featuredProductsSection,
      eq(
        referredProducts.featuredProductsSectionId,
        featuredProductsSection.id,
      ),
    );
  const r = rows.map((r) => ({
    ...r.referredProduct,
    product: r.product,
    featuredProductsSection: r.featuredProductsSection,
  }));
  return { referredProducts: r };
};

export const getReferredProductById = async (id: ReferredProductId) => {
  const { id: referredProductId } = referredProductIdSchema.parse({ id });
  const [row] = await db
    .select({
      referredProduct: referredProducts,
      product: products,
      featuredProductsSection: featuredProductsSection,
    })
    .from(referredProducts)
    .where(eq(referredProducts.id, referredProductId))
    .leftJoin(products, eq(referredProducts.productId, products.id))
    .leftJoin(
      featuredProductsSection,
      eq(
        referredProducts.featuredProductsSectionId,
        featuredProductsSection.id,
      ),
    );
  if (row === undefined) return {};
  const r = {
    ...row.referredProduct,
    product: row.product,
    featuredProductsSection: row.featuredProductsSection,
  };
  return { referredProduct: r };
};
