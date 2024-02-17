import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type HeroCollectionId,
  heroCollectionIdSchema,
  heroCollections,
} from '@/lib/db/schema/heroCollections';
import { collections } from '@/lib/db/schema/collections';
import { heroLinks } from '@/lib/db/schema/heroLinks';

export const getHeroCollections = async () => {
  const rows = await db
    .select({
      heroCollection: heroCollections,
      collection: collections,
      heroLink: heroLinks,
    })
    .from(heroCollections)
    .leftJoin(collections, eq(heroCollections.collectionId, collections.id))
    .leftJoin(heroLinks, eq(heroCollections.heroLinkId, heroLinks.id));
  const h = rows.map((r) => ({
    ...r.heroCollection,
    collection: r.collection,
    heroLink: r.heroLink,
  }));
  return { heroCollections: h };
};

export const getHeroCollectionById = async (id: HeroCollectionId) => {
  const { id: heroCollectionId } = heroCollectionIdSchema.parse({ id });
  const [row] = await db
    .select({
      heroCollection: heroCollections,
      collection: collections,
      heroLink: heroLinks,
    })
    .from(heroCollections)
    .where(eq(heroCollections.id, heroCollectionId))
    .leftJoin(collections, eq(heroCollections.collectionId, collections.id))
    .leftJoin(heroLinks, eq(heroCollections.heroLinkId, heroLinks.id));
  if (row === undefined) return {};
  const h = {
    ...row.heroCollection,
    collection: row.collection,
    heroLink: row.heroLink,
  };
  return { heroCollection: h };
};
