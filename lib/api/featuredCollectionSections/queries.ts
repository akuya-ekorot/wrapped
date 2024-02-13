import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type FeaturedCollectionSectionId,
  featuredCollectionSectionIdSchema,
  featuredCollectionSections,
} from '@/lib/db/schema/featuredCollectionSections';
import { images } from '@/lib/db/schema/images';
import { collections } from '@/lib/db/schema/collections';
import { homePages } from '@/lib/db/schema/homePages';

export const getFeaturedCollectionSections = async () => {
  const rows = await db
    .select({
      featuredCollectionSection: featuredCollectionSections,
      image: images,
      collection: collections,
      homePage: homePages,
    })
    .from(featuredCollectionSections)
    .leftJoin(images, eq(featuredCollectionSections.imageId, images.id))
    .leftJoin(
      collections,
      eq(featuredCollectionSections.collectionId, collections.id),
    )
    .leftJoin(
      homePages,
      eq(featuredCollectionSections.homePageId, homePages.id),
    );
  const f = rows.map((r) => ({
    ...r.featuredCollectionSection,
    image: r.image,
    collection: r.collection,
    homePage: r.homePage,
  }));
  return { featuredCollectionSections: f };
};

export const getFeaturedCollectionSectionById = async (
  id: FeaturedCollectionSectionId,
) => {
  const { id: featuredCollectionSectionId } =
    featuredCollectionSectionIdSchema.parse({ id });
  const [row] = await db
    .select({
      featuredCollectionSection: featuredCollectionSections,
      image: images,
      collection: collections,
      homePage: homePages,
    })
    .from(featuredCollectionSections)
    .where(eq(featuredCollectionSections.id, featuredCollectionSectionId))
    .leftJoin(images, eq(featuredCollectionSections.imageId, images.id))
    .leftJoin(
      collections,
      eq(featuredCollectionSections.collectionId, collections.id),
    )
    .leftJoin(
      homePages,
      eq(featuredCollectionSections.homePageId, homePages.id),
    );
  if (row === undefined) return {};
  const f = {
    ...row.featuredCollectionSection,
    image: row.image,
    collection: row.collection,
    homePage: row.homePage,
  };
  return { featuredCollectionSection: f };
};
