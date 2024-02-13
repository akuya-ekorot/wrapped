import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type FeaturedProductsSectionId,
  featuredProductsSectionIdSchema,
  featuredProductsSection,
} from '@/lib/db/schema/featuredProductsSection';
import { homePages } from '@/lib/db/schema/homePages';
import {
  referredProducts,
  type CompleteReferredProduct,
} from '@/lib/db/schema/referredProducts';

export const getFeaturedProductsSections = async () => {
  const rows = await db
    .select({
      featuredProductsSection: featuredProductsSection,
      homePage: homePages,
    })
    .from(featuredProductsSection)
    .leftJoin(homePages, eq(featuredProductsSection.homePageId, homePages.id));
  const f = rows.map((r) => ({
    ...r.featuredProductsSection,
    homePage: r.homePage,
  }));
  return { featuredProductsSection: f };
};

export const getFeaturedProductsSectionById = async (
  id: FeaturedProductsSectionId,
) => {
  const { id: featuredProductsSectionId } =
    featuredProductsSectionIdSchema.parse({ id });
  const [row] = await db
    .select({
      featuredProductsSection: featuredProductsSection,
      homePage: homePages,
    })
    .from(featuredProductsSection)
    .where(eq(featuredProductsSection.id, featuredProductsSectionId))
    .leftJoin(homePages, eq(featuredProductsSection.homePageId, homePages.id));
  if (row === undefined) return {};
  const f = { ...row.featuredProductsSection, homePage: row.homePage };
  return { featuredProductsSection: f };
};

export const getFeaturedProductsSectionByIdWithReferredProducts = async (
  id: FeaturedProductsSectionId,
) => {
  const { id: featuredProductsSectionId } =
    featuredProductsSectionIdSchema.parse({ id });
  const rows = await db
    .select({
      featuredProductsSection: featuredProductsSection,
      referredProduct: referredProducts,
    })
    .from(featuredProductsSection)
    .where(eq(featuredProductsSection.id, featuredProductsSectionId))
    .leftJoin(
      referredProducts,
      eq(
        featuredProductsSection.id,
        referredProducts.featuredProductsSectionId,
      ),
    );
  if (rows.length === 0) return {};
  const f = rows[0].featuredProductsSection;
  const fr = rows
    .filter((r) => r.referredProduct !== null)
    .map((r) => r.referredProduct) as CompleteReferredProduct[];

  return { featuredProductsSection: f, referredProducts: fr };
};
