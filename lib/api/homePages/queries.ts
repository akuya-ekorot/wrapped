import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type HomePageId,
  homePageIdSchema,
  homePages,
} from '@/lib/db/schema/homePages';
import {
  heroSections,
  type CompleteHeroSection,
} from '@/lib/db/schema/heroSections';
import {
  mainCollections,
  type CompleteMainCollection,
} from '@/lib/db/schema/mainCollections';
import {
  featuredCollectionSections,
  type CompleteFeaturedCollectionSection,
} from '@/lib/db/schema/featuredCollectionSections';
import {
  featuredProductsSection,
  type CompleteFeaturedProductsSection,
} from '@/lib/db/schema/featuredProductsSection';
import { collections } from '@/lib/db/schema/collections';
import { images } from '@/lib/db/schema/images';

export const getHomePages = async () => {
  const rows = await db.select().from(homePages);
  const h = rows;
  return { homePages: h };
};

export const getHomePageById = async (id: HomePageId) => {
  const { id: homePageId } = homePageIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(homePages)
    .where(eq(homePages.id, homePageId));
  if (row === undefined) return {};
  const h = row;
  return { homePage: h };
};

export const getHomePageByIdWithHeroSectionsAndMainCollectionsAndFeaturedCollectionSectionsAndFeaturedProductsSection =
  async (id: HomePageId) => {
    const { id: homePageId } = homePageIdSchema.parse({ id });
    const rows = await db
      .select({
        homePage: homePages,
        heroSection: heroSections,
        mainCollection: mainCollections,
        featuredCollectionSection: featuredCollectionSections,
        featuredProductsSection: featuredProductsSection,
        collection: collections,
        image: images,
      })
      .from(homePages)
      .where(eq(homePages.id, homePageId))
      .leftJoin(heroSections, eq(homePages.id, heroSections.homePageId))
      .leftJoin(mainCollections, eq(homePages.id, mainCollections.homePageId))
      .leftJoin(
        featuredCollectionSections,
        eq(homePages.id, featuredCollectionSections.homePageId),
      )
      .leftJoin(
        collections,
        eq(collections.id, featuredCollectionSections.collectionId),
      )
      .leftJoin(images, eq(images.id, featuredCollectionSections.imageId))
      .leftJoin(
        featuredProductsSection,
        eq(homePages.id, featuredProductsSection.homePageId),
      );

    if (rows.length === 0) return {};

    const h = rows[0].homePage;
    const hs = rows
      .filter((r) => r.heroSection !== null)
      .map((h) => h.heroSection) as CompleteHeroSection[];
    const hm = rows
      .filter((r) => r.mainCollection !== null)
      .map((m) => m.mainCollection) as CompleteMainCollection[];
    const hfc = rows
      .filter((r) => r.featuredCollectionSection !== null)
      .map((f) => ({
        ...f.featuredCollectionSection,
        collection: f.collection,
        image: f.image,
      })) as CompleteFeaturedCollectionSection[];
    const hfp = rows
      .filter((r) => r.featuredProductsSection !== null)
      .map(
        (f) => f.featuredProductsSection,
      ) as CompleteFeaturedProductsSection[];

    return {
      homePage: h,
      heroSections: hs,
      mainCollections: hm,
      featuredCollectionSections: hfc,
      featuredProductsSection: hfp,
    };
  };
