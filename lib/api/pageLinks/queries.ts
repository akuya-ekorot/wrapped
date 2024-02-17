import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type PageLinkId,
  pageLinkIdSchema,
  pageLinks,
} from '@/lib/db/schema/pageLinks';
import {
  linkToCollections,
  type CompleteLinkToCollection,
} from '@/lib/db/schema/linkToCollections';
import {
  linkToProducts,
  type CompleteLinkToProduct,
} from '@/lib/db/schema/linkToProducts';
import { products } from '@/lib/db/schema/products';
import { collections } from '@/lib/db/schema/collections';

export const getPageLinks = async () => {
  const rows = await db.select().from(pageLinks);
  const p = rows;
  return { pageLinks: p };
};

export const getPageLinkById = async (id: PageLinkId) => {
  const { id: pageLinkId } = pageLinkIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(pageLinks)
    .where(eq(pageLinks.id, pageLinkId));
  if (row === undefined) return {};
  const p = row;
  return { pageLink: p };
};

export const getPageLinkByIdWithLinkToCollectionsAndLinkToProducts = async (
  id: PageLinkId,
) => {
  const { id: pageLinkId } = pageLinkIdSchema.parse({ id });
  const rows = await db
    .select({
      pageLink: pageLinks,
      linkToCollection: linkToCollections,
      linkToProduct: linkToProducts,
      product: products,
      collection: collections,
    })
    .from(pageLinks)
    .where(eq(pageLinks.id, pageLinkId))
    .leftJoin(linkToCollections, eq(pageLinks.id, linkToCollections.pageLinkId))
    .leftJoin(collections, eq(linkToCollections.collectionId, collections.id))
    .leftJoin(linkToProducts, eq(pageLinks.id, linkToProducts.pageLinkId))
    .leftJoin(products, eq(linkToProducts.productId, products.id));

  if (rows.length === 0) return {};

  const p = rows[0].pageLink;

  const plc = rows
    .filter((r) => r.linkToCollection !== null)
    .filter(
      (l, i, a) =>
        a.findIndex(
          (x) => x.linkToCollection!.id === l.linkToCollection!.id,
        ) === i,
    )
    .map((l) => ({
      ...l.linkToCollection,
      collection: l.collection,
    })) as CompleteLinkToCollection[];

  const plp = rows
    .filter((r) => r.linkToProduct !== null)
    .filter(
      (l, i, a) =>
        a.findIndex((x) => x.linkToProduct!.id === l.linkToProduct!.id) === i,
    )
    .map((l) => ({
      ...l.linkToProduct,
      product: l.product,
    })) as CompleteLinkToProduct[];

  return { pageLink: p, linkToCollections: plc, linkToProducts: plp };
};
