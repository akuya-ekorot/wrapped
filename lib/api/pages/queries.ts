import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type PageId, pageIdSchema, pages } from "@/lib/db/schema/pages";
import { contentBlocks, type CompleteContentBlock } from "@/lib/db/schema/contentBlocks";

export const getPages = async () => {
  const rows = await db.select().from(pages);
  const p = rows
  return { pages: p };
};

export const getPageById = async (id: PageId) => {
  const { id: pageId } = pageIdSchema.parse({ id });
  const [row] = await db.select().from(pages).where(eq(pages.id, pageId));
  if (row === undefined) return {};
  const p = row;
  return { page: p };
};

export const getPageByIdWithContentBlocks = async (id: PageId) => {
  const { id: pageId } = pageIdSchema.parse({ id });
  const rows = await db.select({ page: pages, contentBlock: contentBlocks }).from(pages).where(eq(pages.id, pageId)).leftJoin(contentBlocks, eq(pages.id, contentBlocks.pageId));
  if (rows.length === 0) return {};
  const p = rows[0].page;
  const pc = rows.filter((r) => r.contentBlock !== null).map((c) => c.contentBlock) as CompleteContentBlock[];

  return { page: p, contentBlocks: pc };
};

