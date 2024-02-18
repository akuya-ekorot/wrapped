import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  ContentBlockId,
  NewContentBlockParams,
  UpdateContentBlockParams,
  updateContentBlockSchema,
  insertContentBlockSchema,
  contentBlocks,
  contentBlockIdSchema,
} from '@/lib/db/schema/contentBlocks';

export const createContentBlock = async (
  contentBlock: NewContentBlockParams,
) => {
  const newContentBlock = insertContentBlockSchema.parse(contentBlock);
  try {
    const [c] = await db
      .insert(contentBlocks)
      .values(newContentBlock)
      .returning();
    return { contentBlock: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateContentBlock = async (
  id: ContentBlockId,
  contentBlock: UpdateContentBlockParams,
) => {
  const { id: contentBlockId } = contentBlockIdSchema.parse({ id });
  const newContentBlock = updateContentBlockSchema.parse(contentBlock);
  try {
    const [c] = await db
      .update(contentBlocks)
      .set({ ...newContentBlock, updatedAt: new Date() })
      .where(eq(contentBlocks.id, contentBlockId!))
      .returning();
    return { contentBlock: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteContentBlock = async (id: ContentBlockId) => {
  const { id: contentBlockId } = contentBlockIdSchema.parse({ id });
  try {
    const [c] = await db
      .delete(contentBlocks)
      .where(eq(contentBlocks.id, contentBlockId!))
      .returning();
    return { contentBlock: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
