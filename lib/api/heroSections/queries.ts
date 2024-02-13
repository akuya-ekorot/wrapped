import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type HeroSectionId,
  heroSectionIdSchema,
  heroSections,
} from '@/lib/db/schema/heroSections';
import { images } from '@/lib/db/schema/images';
import { homePages } from '@/lib/db/schema/homePages';
import { heroLinks, type CompleteHeroLink } from '@/lib/db/schema/heroLinks';

export const getHeroSections = async () => {
  const rows = await db
    .select({ heroSection: heroSections, image: images, homePage: homePages })
    .from(heroSections)
    .leftJoin(images, eq(heroSections.imageId, images.id))
    .leftJoin(homePages, eq(heroSections.homePageId, homePages.id));
  const h = rows.map((r) => ({
    ...r.heroSection,
    image: r.image,
    homePage: r.homePage,
  }));
  return { heroSections: h };
};

export const getHeroSectionById = async (id: HeroSectionId) => {
  const { id: heroSectionId } = heroSectionIdSchema.parse({ id });
  const [row] = await db
    .select({ heroSection: heroSections, image: images, homePage: homePages })
    .from(heroSections)
    .where(eq(heroSections.id, heroSectionId))
    .leftJoin(images, eq(heroSections.imageId, images.id))
    .leftJoin(homePages, eq(heroSections.homePageId, homePages.id));
  if (row === undefined) return {};
  const h = { ...row.heroSection, image: row.image, homePage: row.homePage };
  return { heroSection: h };
};

export const getHeroSectionByIdWithHeroLinks = async (id: HeroSectionId) => {
  const { id: heroSectionId } = heroSectionIdSchema.parse({ id });
  const rows = await db
    .select({ heroSection: heroSections, heroLink: heroLinks })
    .from(heroSections)
    .where(eq(heroSections.id, heroSectionId))
    .leftJoin(heroLinks, eq(heroSections.id, heroLinks.heroSectionId));
  if (rows.length === 0) return {};
  const h = rows[0].heroSection;
  const hh = rows
    .filter((r) => r.heroLink !== null)
    .map((h) => h.heroLink) as CompleteHeroLink[];

  return { heroSection: h, heroLinks: hh };
};
