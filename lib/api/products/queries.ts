import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type ProductId,
  productIdSchema,
  products,
} from '@/lib/db/schema/products';
import { collections } from '@/lib/db/schema/collections';
import {
  productImages,
  type CompleteProductImage,
} from '@/lib/db/schema/productImages';
import { options, type CompleteOption } from '@/lib/db/schema/options';
import {
  productTags,
  type CompleteProductTag,
} from '@/lib/db/schema/productTags';
import { CompleteImage, images } from '@/lib/db/schema/images';

export const getProducts = async () => {
  const rows = await db
    .select({ product: products, collection: collections })
    .from(products)
    .leftJoin(collections, eq(products.collectionId, collections.id));
  const p = rows.map((r) => ({ ...r.product, collection: r.collection }));
  return { products: p };
};

export const getProductById = async (id: ProductId) => {
  const { id: productId } = productIdSchema.parse({ id });
  const [row] = await db
    .select({ product: products, collection: collections })
    .from(products)
    .where(eq(products.id, productId))
    .leftJoin(collections, eq(products.collectionId, collections.id));
  if (row === undefined) return {};
  const p = { ...row.product, collection: row.collection };
  return { product: p };
};

export const getProductByIdWithProductImagesAndOptionsAndProductTags = async (
  id: ProductId,
) => {
  const { id: productId } = productIdSchema.parse({ id });
  const rows = await db
    .select({
      product: products,
      productImage: productImages,
      option: options,
      productTag: productTags,
      image: images,
    })
    .from(products)
    .where(eq(products.id, productId))
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(images, eq(productImages.imageId, images.id))
    .leftJoin(options, eq(products.id, options.productId))
    .leftJoin(productTags, eq(products.id, productTags.productId));

  if (rows.length === 0) return {};

  const p = rows[0].product;

  const p_images = rows
    .filter((r) => r.productImage !== null)
    .filter(
      (r, i, self) =>
        self.findIndex((s) => s.productImage!.id === r.productImage!.id) === i,
    )
    .map((p) => p.productImage) as CompleteProductImage[];

  const p_i = rows
    .filter((r) => r.image !== null)
    .filter(
      (r, i, self) => self.findIndex((s) => s.image!.id === r.image!.id) === i,
    )
    .map((p) => p.image) as CompleteImage[];

  const po = rows
    .filter((r) => r.option !== null)
    .filter(
      (r, i, self) =>
        self.findIndex((s) => s.option!.id === r.option!.id) === i,
    )
    .map((o) => o.option) as CompleteOption[];

  const p_tags = rows
    .filter((r) => r.productTag !== null)
    .filter(
      (r, i, self) =>
        self.findIndex((s) => s.productTag!.id === r.productTag!.id) === i,
    )
    .map((p) => p.productTag) as CompleteProductTag[];

  return {
    product: p,
    productImages: p_images,
    images: p_i,
    options: po,
    productTags: p_tags,
  };
};
