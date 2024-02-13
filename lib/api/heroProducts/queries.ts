import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type HeroProductId,
  heroProductIdSchema,
  heroProducts,
} from '@/lib/db/schema/heroProducts';
import { products } from '@/lib/db/schema/products';
import { heroLinks } from '@/lib/db/schema/heroLinks';

export const getHeroProducts = async () => {
  const rows = await db
    .select({
      heroProduct: heroProducts,
      product: products,
      heroLink: heroLinks,
    })
    .from(heroProducts)
    .leftJoin(products, eq(heroProducts.productId, products.id))
    .leftJoin(heroLinks, eq(heroProducts.heroLinkId, heroLinks.id));
  const h = rows.map((r) => ({
    ...r.heroProduct,
    product: r.product,
    heroLink: r.heroLink,
  }));
  return { heroProducts: h };
};

export const getHeroProductById = async (id: HeroProductId) => {
  const { id: heroProductId } = heroProductIdSchema.parse({ id });
  const [row] = await db
    .select({
      heroProduct: heroProducts,
      product: products,
      heroLink: heroLinks,
    })
    .from(heroProducts)
    .where(eq(heroProducts.id, heroProductId))
    .leftJoin(products, eq(heroProducts.productId, products.id))
    .leftJoin(heroLinks, eq(heroProducts.heroLinkId, heroLinks.id));
  if (row === undefined) return {};
  const h = {
    ...row.heroProduct,
    product: row.product,
    heroLink: row.heroLink,
  };
  return { heroProduct: h };
};
