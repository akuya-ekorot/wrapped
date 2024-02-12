import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type LinkToCollectionId,
  linkToCollectionIdSchema,
  linkToCollections,
} from '@/lib/db/schema/linkToCollections';
import { collections } from '@/lib/db/schema/collections';
import { pageLinks } from '@/lib/db/schema/pageLinks';

export const getLinkToCollections = async () => {
  const rows = await db
    .select({
      linkToCollection: linkToCollections,
      collection: collections,
      pageLink: pageLinks,
    })
    .from(linkToCollections)
    .leftJoin(collections, eq(linkToCollections.collectionId, collections.id))
    .leftJoin(pageLinks, eq(linkToCollections.pageLinkId, pageLinks.id));
  const l = rows.map((r) => ({
    ...r.linkToCollection,
    collection: r.collection,
    pageLink: r.pageLink,
  }));
  return { linkToCollections: l };
};

export const getLinkToCollectionById = async (id: LinkToCollectionId) => {
  const { id: linkToCollectionId } = linkToCollectionIdSchema.parse({ id });
  const [row] = await db
    .select({
      linkToCollection: linkToCollections,
      collection: collections,
      pageLink: pageLinks,
    })
    .from(linkToCollections)
    .where(eq(linkToCollections.id, linkToCollectionId))
    .leftJoin(collections, eq(linkToCollections.collectionId, collections.id))
    .leftJoin(pageLinks, eq(linkToCollections.pageLinkId, pageLinks.id));
  if (row === undefined) return {};
  const l = {
    ...row.linkToCollection,
    collection: row.collection,
    pageLink: row.pageLink,
  };
  return { linkToCollection: l };
};
