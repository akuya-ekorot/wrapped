import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  PageLinkId,
  NewPageLinkParams,
  UpdatePageLinkParams,
  updatePageLinkSchema,
  insertPageLinkSchema,
  pageLinks,
  pageLinkIdSchema,
} from '@/lib/db/schema/pageLinks';

export const createPageLink = async (pageLink: NewPageLinkParams) => {
  const newPageLink = insertPageLinkSchema.parse(pageLink);
  try {
    const [p] = await db.insert(pageLinks).values(newPageLink).returning();
    return { pageLink: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updatePageLink = async (
  id: PageLinkId,
  pageLink: UpdatePageLinkParams,
) => {
  const { id: pageLinkId } = pageLinkIdSchema.parse({ id });
  const newPageLink = updatePageLinkSchema.parse(pageLink);
  try {
    const [p] = await db
      .update(pageLinks)
      .set({ ...newPageLink, updatedAt: new Date() })
      .where(eq(pageLinks.id, pageLinkId!))
      .returning();
    return { pageLink: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deletePageLink = async (id: PageLinkId) => {
  const { id: pageLinkId } = pageLinkIdSchema.parse({ id });
  try {
    const [p] = await db
      .delete(pageLinks)
      .where(eq(pageLinks.id, pageLinkId!))
      .returning();
    return { pageLink: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
