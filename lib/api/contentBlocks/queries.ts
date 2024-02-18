import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type ContentBlockId,
  contentBlockIdSchema,
  contentBlocks,
} from '@/lib/db/schema/contentBlocks';
import { pages } from '@/lib/db/schema/pages';

export const getContentBlocks = async () => {
  const rows = await db
    .select({ contentBlock: contentBlocks, page: pages })
    .from(contentBlocks)
    .leftJoin(pages, eq(contentBlocks.pageId, pages.id));
  const c = rows.map((r) => ({ ...r.contentBlock, page: r.page }));
  return { contentBlocks: c };
};

export const getContentBlockById = async (id: ContentBlockId) => {
  const { id: contentBlockId } = contentBlockIdSchema.parse({ id });
  const [row] = await db
    .select({ contentBlock: contentBlocks, page: pages })
    .from(contentBlocks)
    .where(eq(contentBlocks.id, contentBlockId))
    .leftJoin(pages, eq(contentBlocks.pageId, pages.id));
  if (row === undefined) return {};
  const c = { ...row.contentBlock, page: row.page };
  return { contentBlock: c };
};
