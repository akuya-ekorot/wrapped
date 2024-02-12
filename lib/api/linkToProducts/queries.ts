import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type LinkToProductId,
  linkToProductIdSchema,
  linkToProducts,
} from '@/lib/db/schema/linkToProducts';
import { products } from '@/lib/db/schema/products';
import { pageLinks } from '@/lib/db/schema/pageLinks';

export const getLinkToProducts = async () => {
  const rows = await db
    .select({
      linkToProduct: linkToProducts,
      product: products,
      pageLink: pageLinks,
    })
    .from(linkToProducts)
    .leftJoin(products, eq(linkToProducts.productId, products.id))
    .leftJoin(pageLinks, eq(linkToProducts.pageLinkId, pageLinks.id));
  const l = rows.map((r) => ({
    ...r.linkToProduct,
    product: r.product,
    pageLink: r.pageLink,
  }));
  return { linkToProducts: l };
};

export const getLinkToProductById = async (id: LinkToProductId) => {
  const { id: linkToProductId } = linkToProductIdSchema.parse({ id });
  const [row] = await db
    .select({
      linkToProduct: linkToProducts,
      product: products,
      pageLink: pageLinks,
    })
    .from(linkToProducts)
    .where(eq(linkToProducts.id, linkToProductId))
    .leftJoin(products, eq(linkToProducts.productId, products.id))
    .leftJoin(pageLinks, eq(linkToProducts.pageLinkId, pageLinks.id));
  if (row === undefined) return {};
  const l = {
    ...row.linkToProduct,
    product: row.product,
    pageLink: row.pageLink,
  };
  return { linkToProduct: l };
};
