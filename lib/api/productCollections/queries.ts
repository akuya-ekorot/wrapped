import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type ProductCollectionId,
  productCollectionIdSchema,
  productCollections,
} from '@/lib/db/schema/productCollections';
import {
  CollectionId,
  collectionIdSchema,
  collections,
} from '@/lib/db/schema/collections';
import { ProductId, productIdSchema, products } from '@/lib/db/schema/products';

export const getProductCollectionsByProductId = async (id: ProductId) => {
  const { id: productId } = productIdSchema.parse({ id });

  const rows = await db
    .select({
      productCollection: productCollections,
      collection: collections,
      product: products,
    })
    .from(productCollections)
    .where(eq(productCollections.productId, productId))
    .leftJoin(collections, eq(productCollections.collectionId, collections.id))
    .leftJoin(products, eq(productCollections.productId, products.id));

  const p = rows.map((r) => ({
    ...r.productCollection,
    collection: r.collection,
    product: r.product,
  }));

  return { productCollections: p };
};

export const getProductCollectionsByCollectionId = async (id: CollectionId) => {
  const { id: collectionId } = collectionIdSchema.parse({ id });

  const rows = await db
    .select({
      productCollection: productCollections,
      collection: collections,
      product: products,
    })
    .from(productCollections)
    .where(eq(productCollections.collectionId, collectionId))
    .leftJoin(collections, eq(productCollections.collectionId, collections.id))
    .leftJoin(products, eq(productCollections.productId, products.id));

  const p = rows.map((r) => ({
    ...r.productCollection,
    collection: r.collection,
    product: r.product,
  }));
  return { productCollections: p };
};

export const getProductCollections = async () => {
  const rows = await db
    .select({
      productCollection: productCollections,
      collection: collections,
      product: products,
    })
    .from(productCollections)
    .leftJoin(collections, eq(productCollections.collectionId, collections.id))
    .leftJoin(products, eq(productCollections.productId, products.id));
  const p = rows.map((r) => ({
    ...r.productCollection,
    collection: r.collection,
    product: r.product,
  }));
  return { productCollections: p };
};

export const getProductCollectionById = async (id: ProductCollectionId) => {
  const { id: productCollectionId } = productCollectionIdSchema.parse({ id });
  const [row] = await db
    .select({
      productCollection: productCollections,
      collection: collections,
      product: products,
    })
    .from(productCollections)
    .where(eq(productCollections.id, productCollectionId))
    .leftJoin(collections, eq(productCollections.collectionId, collections.id))
    .leftJoin(products, eq(productCollections.productId, products.id));
  if (row === undefined) return {};
  const p = {
    ...row.productCollection,
    collection: row.collection,
    product: row.product,
  };
  return { productCollection: p };
};
