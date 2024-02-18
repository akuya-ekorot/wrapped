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
import {
  products,
  type CompleteProduct,
  Product,
} from '@/lib/db/schema/products';
import { productCollections } from '@/lib/db/schema/productCollections';
import { TImage, images } from '@/lib/db/schema/images';
import { productImages } from '@/lib/db/schema/productImages';

export const getCollections = async () => {
  const rows = await db.select().from(collections);
  const c = rows;
  return { collections: c };
};

export const getCollectionPageDetailsById = async (id: CollectionId) => {
  const { id: collectionId } = collectionIdSchema.parse({ id });

  const rows = await db
    .select({
      collection: collections,
      product: products,
      image: images,
    })
    .from(collections)
    .where(eq(collections.id, collectionId))
    .leftJoin(
      productCollections,
      eq(collections.id, productCollections.collectionId),
    )
    .leftJoin(products, eq(productCollections.productId, products.id))
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(images, eq(productImages.imageId, images.id));

  if (rows.length === 0) return null;

  const c = rows[0].collection;
  const c_products = rows
    .filter((r) => r.product !== null)
    .filter(
      (r, i, a) => a.findIndex((rr) => rr.product!.id === r.product!.id) === i,
    )
    .map((p) => p.product)
    .map((p) => {
      const productImages = rows
        .filter((r) => r.product !== null)
        .filter((r) => r.product!.id === p!.id)
        .map((r) => r.image)
        .filter((r) => r !== null) as TImage[];

      return { ...p, images: productImages };
    });

  return { ...c, products: c_products };
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
    .leftJoin(
      productCollections,
      eq(collections.id, productCollections.collectionId),
    )
    .leftJoin(products, eq(productCollections.productId, products.id));

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
