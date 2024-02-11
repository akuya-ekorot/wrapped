import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type CollectionId,
  collectionIdSchema,
  collections,
} from '@/lib/db/schema/collections';
import {
  collectionImages,
  type CompleteCollectionImage,
} from '@/lib/db/schema/collectionImages';
import { products, type CompleteProduct } from '@/lib/db/schema/products';

export const getCollections = async () => {
  const rows = await db.select().from(collections);
  const c = rows;
  return { collections: c };
};

export const getCollectionById = async (id: CollectionId) => {
  const { id: collectionId } = collectionIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(collections)
    .where(eq(collections.id, collectionId));
  if (row === undefined) return {};
  const c = row;
  return { collection: c };
};

export const getCollectionByIdWithCollectionImagesAndProducts = async (
  id: CollectionId,
) => {
  const { id: collectionId } = collectionIdSchema.parse({ id });
  const rows = await db
    .select({
      collection: collections,
      collectionImage: collectionImages,
      product: products,
    })
    .from(collections)
    .where(eq(collections.id, collectionId))
    .leftJoin(
      collectionImages,
      eq(collections.id, collectionImages.collectionId),
    )
    .leftJoin(products, eq(collections.id, products.collectionId));
  if (rows.length === 0) return {};
  const c = rows[0].collection;
  const cc = rows
    .filter((r) => r.collectionImage !== null)
    .map((c) => c.collectionImage) as CompleteCollectionImage[];
  const cp = rows
    .filter((r) => r.product !== null)
    .map((p) => p.product) as CompleteProduct[];

  return { collection: c, collectionImages: cc, products: cp };
};
