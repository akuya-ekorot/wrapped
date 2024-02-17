import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type MainCollectionId,
  mainCollectionIdSchema,
  mainCollections,
} from '@/lib/db/schema/mainCollections';
import { homePages } from '@/lib/db/schema/homePages';
import {
  referredCollections,
  type CompleteReferredCollection,
} from '@/lib/db/schema/referredCollections';
import { collections } from '@/lib/db/schema/collections';

export const getMainCollections = async () => {
  const rows = await db
    .select({ mainCollection: mainCollections, homePage: homePages })
    .from(mainCollections)
    .leftJoin(homePages, eq(mainCollections.homePageId, homePages.id));
  const m = rows.map((r) => ({ ...r.mainCollection, homePage: r.homePage }));
  return { mainCollections: m };
};

export const getMainCollectionById = async (id: MainCollectionId) => {
  const { id: mainCollectionId } = mainCollectionIdSchema.parse({ id });
  const [row] = await db
    .select({ mainCollection: mainCollections, homePage: homePages })
    .from(mainCollections)
    .where(eq(mainCollections.id, mainCollectionId))
    .leftJoin(homePages, eq(mainCollections.homePageId, homePages.id));
  if (row === undefined) return {};
  const m = { ...row.mainCollection, homePage: row.homePage };
  return { mainCollection: m };
};

export const getMainCollectionByIdWithReferredCollections = async (
  id: MainCollectionId,
) => {
  const { id: mainCollectionId } = mainCollectionIdSchema.parse({ id });
  const rows = await db
    .select({
      mainCollection: mainCollections,
      referredCollection: referredCollections,
      collection: collections,
    })
    .from(mainCollections)
    .where(eq(mainCollections.id, mainCollectionId))
    .leftJoin(
      referredCollections,
      eq(mainCollections.id, referredCollections.mainCollectionId),
    )
    .leftJoin(
      collections,
      eq(referredCollections.collectionId, collections.id),
    );

  if (rows.length === 0) return {};

  const m = rows[0].mainCollection;
  const mr = rows
    .filter((r) => r.referredCollection !== null)
    .map((r) => ({
      ...r.referredCollection,
      collection: r.collection,
    })) as CompleteReferredCollection[];

  return { mainCollection: m, referredCollections: mr };
};
