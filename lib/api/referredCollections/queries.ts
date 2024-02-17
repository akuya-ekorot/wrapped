import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type ReferredCollectionId,
  referredCollectionIdSchema,
  referredCollections,
} from '@/lib/db/schema/referredCollections';
import { collections } from '@/lib/db/schema/collections';
import { mainCollections } from '@/lib/db/schema/mainCollections';

export const getReferredCollections = async () => {
  const rows = await db
    .select({
      referredCollection: referredCollections,
      collection: collections,
      mainCollection: mainCollections,
    })
    .from(referredCollections)
    .leftJoin(collections, eq(referredCollections.collectionId, collections.id))
    .leftJoin(
      mainCollections,
      eq(referredCollections.mainCollectionId, mainCollections.id),
    );
  const r = rows.map((r) => ({
    ...r.referredCollection,
    collection: r.collection,
    mainCollection: r.mainCollection,
  }));
  return { referredCollections: r };
};

export const getReferredCollectionById = async (id: ReferredCollectionId) => {
  const { id: referredCollectionId } = referredCollectionIdSchema.parse({ id });
  const [row] = await db
    .select({
      referredCollection: referredCollections,
      collection: collections,
      mainCollection: mainCollections,
    })
    .from(referredCollections)
    .where(eq(referredCollections.id, referredCollectionId))
    .leftJoin(collections, eq(referredCollections.collectionId, collections.id))
    .leftJoin(
      mainCollections,
      eq(referredCollections.mainCollectionId, mainCollections.id),
    );
  if (row === undefined) return {};
  const r = {
    ...row.referredCollection,
    collection: row.collection,
    mainCollection: row.mainCollection,
  };
  return { referredCollection: r };
};
