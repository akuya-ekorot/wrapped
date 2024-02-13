import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type HeroLinkId,
  heroLinkIdSchema,
  heroLinks,
} from '@/lib/db/schema/heroLinks';
import { heroSections } from '@/lib/db/schema/heroSections';
import {
  heroCollections,
  type CompleteHeroCollection,
} from '@/lib/db/schema/heroCollections';
import {
  heroProducts,
  type CompleteHeroProduct,
} from '@/lib/db/schema/heroProducts';
import { products } from '@/lib/db/schema/products';
import { collections } from '@/lib/db/schema/collections';

export const getHeroLinks = async () => {
  const rows = await db
    .select({ heroLink: heroLinks, heroSection: heroSections })
    .from(heroLinks)
    .leftJoin(heroSections, eq(heroLinks.heroSectionId, heroSections.id));
  const h = rows.map((r) => ({ ...r.heroLink, heroSection: r.heroSection }));
  return { heroLinks: h };
};

export const getHeroLinkById = async (id: HeroLinkId) => {
  const { id: heroLinkId } = heroLinkIdSchema.parse({ id });
  const [row] = await db
    .select({ heroLink: heroLinks, heroSection: heroSections })
    .from(heroLinks)
    .where(eq(heroLinks.id, heroLinkId))
    .leftJoin(heroSections, eq(heroLinks.heroSectionId, heroSections.id));
  if (row === undefined) return {};
  const h = { ...row.heroLink, heroSection: row.heroSection };
  return { heroLink: h };
};

export const getHeroLinkByIdWithHeroCollectionsAndHeroProducts = async (
  id: HeroLinkId,
) => {
  const { id: heroLinkId } = heroLinkIdSchema.parse({ id });
  const rows = await db
    .select({
      heroLink: heroLinks,
      heroCollection: heroCollections,
      heroProduct: heroProducts,
      product: products,
      collection: collections,
    })
    .from(heroLinks)
    .where(eq(heroLinks.id, heroLinkId))
    .leftJoin(heroCollections, eq(heroLinks.id, heroCollections.heroLinkId))
    .leftJoin(heroProducts, eq(heroLinks.id, heroProducts.heroLinkId))
    .leftJoin(products, eq(heroProducts.productId, products.id))
    .leftJoin(collections, eq(heroCollections.collectionId, collections.id));

  if (rows.length === 0) return {};
  const h = rows[0].heroLink;
  const hc = rows
    .filter((r) => r.heroCollection !== null)
    .map((h) => ({
      ...h.heroCollection,
      collection: h.collection,
      heroLink: h.heroLink,
    })) as CompleteHeroCollection[];

  const hp = rows
    .filter((r) => r.heroProduct !== null)
    .map((h) => ({
      ...h.heroProduct,
      product: h.product,
      heroLink: h.heroLink,
    })) as CompleteHeroProduct[];

  return { heroLink: h, heroCollections: hc, heroProducts: hp };
};
