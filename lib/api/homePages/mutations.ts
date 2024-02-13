import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  HomePageId,
  NewHomePageParams,
  UpdateHomePageParams,
  updateHomePageSchema,
  insertHomePageSchema,
  homePages,
  homePageIdSchema,
} from '@/lib/db/schema/homePages';

export const createHomePage = async (homePage: NewHomePageParams) => {
  const newHomePage = insertHomePageSchema.parse(homePage);
  try {
    const [h] = await db.insert(homePages).values(newHomePage).returning();
    return { homePage: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateHomePage = async (
  id: HomePageId,
  homePage: UpdateHomePageParams,
) => {
  const { id: homePageId } = homePageIdSchema.parse({ id });
  const newHomePage = updateHomePageSchema.parse(homePage);
  try {
    const [h] = await db
      .update(homePages)
      .set(newHomePage)
      .where(eq(homePages.id, homePageId!))
      .returning();
    return { homePage: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteHomePage = async (id: HomePageId) => {
  const { id: homePageId } = homePageIdSchema.parse({ id });
  try {
    const [h] = await db
      .delete(homePages)
      .where(eq(homePages.id, homePageId!))
      .returning();
    return { homePage: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
