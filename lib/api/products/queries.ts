import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type ProductId,
  productIdSchema,
  products,
} from '@/lib/db/schema/products';
import { Collection, collections } from '@/lib/db/schema/collections';
import {
  productImages,
  type CompleteProductImage,
} from '@/lib/db/schema/productImages';
import { options, type CompleteOption } from '@/lib/db/schema/options';
import {
  productTags,
  type CompleteProductTag,
} from '@/lib/db/schema/productTags';
import { CompleteImage, TImage, images } from '@/lib/db/schema/images';
import { OptionValue, optionValues } from '@/lib/db/schema/optionValues';
import { variants } from '@/lib/db/schema/variants';
import { VariantOption, variantOptions } from '@/lib/db/schema/variantOptions';
import { variantImages } from '@/lib/db/schema/variantImages';
import {
  ProductCollection,
  productCollections,
} from '@/lib/db/schema/productCollections';

export const getProducts = async () => {
  const rows = await db
    .select({
      product: products,
      collection: collections,
      productCollection: productCollections,
    })
    .from(products)
    .leftJoin(productCollections, eq(products.id, productCollections.productId))
    .leftJoin(collections, eq(productCollections.collectionId, collections.id));

  const p_pcollections = rows
    .filter((r) => r.productCollection !== null)
    .filter(
      (r, i, self) =>
        self.findIndex(
          (s) =>
            s.productCollection!.collectionId ===
            r.productCollection!.collectionId,
        ) === i,
    )
    .map((r) => r.productCollection) as ProductCollection[];

  const p_collections = rows
    .filter((r) => r.collection !== null)
    .filter(
      (r, i, self) =>
        self.findIndex((s) => s.collection!.id === r.collection!.id) === i,
    )
    .map((r) => r.collection) as Collection[];

  const p = rows
    .filter((r) => r.product !== null)
    .map((r) => ({
      ...r.product,
      collections: p_pcollections
        .filter((pc) => pc.productId === r.product!.id)
        .map((pc) =>
          p_collections.find((c) => c.id === pc.collectionId),
        ) as Collection[],
    }));

  return { products: p };
};

export const getProductById = async (id: ProductId) => {
  const { id: productId } = productIdSchema.parse({ id });
  const [row] = await db
    .select({ product: products, collection: collections })
    .from(products)
    .where(eq(products.id, productId))
    .leftJoin(productCollections, eq(products.id, productCollections.productId))
    .leftJoin(collections, eq(productCollections.collectionId, collections.id));

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
      optionValue: optionValues,
      productTag: productTags,
      image: images,
    })
    .from(products)
    .where(eq(products.id, productId))
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(images, eq(productImages.imageId, images.id))
    .leftJoin(options, eq(products.id, options.productId))
    .leftJoin(productTags, eq(products.id, productTags.productId))
    .leftJoin(optionValues, eq(options.id, optionValues.optionId));

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
    .map((o) => ({
      ...o.option,
      optionValues: rows
        .filter((r) => r.optionValue !== null)
        .filter(
          (r, i, self) =>
            self.findIndex((s) => s.optionValue!.id === r.optionValue!.id) ===
            i,
        )
        .map((v) => v.optionValue) as OptionValue[],
    })) as CompleteOption[];

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

export type CompleteProductPage = NonNullable<
  Awaited<ReturnType<typeof getProductPageDetailsByProductId>>
>;

export const getProductPageDetailsByProductId = async (id: ProductId) => {
  const { id: productId } = productIdSchema.parse({ id });

  const rows = await db
    .select({
      product: products,
      collection: collections,
      option: options,
      optionValue: optionValues,
      variant: variants,
      variantOption: variantOptions,
      variantImage: variantImages,
      productImage: productImages,
      image: images,
    })
    .from(products)
    .where(eq(products.id, productId))
    .leftJoin(productCollections, eq(products.id, productCollections.productId))
    .leftJoin(collections, eq(productCollections.productId, collections.id))
    .leftJoin(options, eq(options.productId, productId))
    .leftJoin(optionValues, eq(options.id, optionValues.optionId))
    .leftJoin(variants, eq(variants.productId, productId))
    .leftJoin(variantOptions, eq(variants.id, variantOptions.variantId))
    .leftJoin(variantImages, eq(variants.id, variantImages.variantId))
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(images, eq(productImages.imageId, images.id));

  if (rows.length === 0) return null;

  const p = rows[0].product;
  const p_collections = rows
    .filter((r) => r.collection !== null)
    .filter(
      (r, i, self) =>
        self.findIndex((s) => s.collection!.id === r.collection!.id) === i,
    )
    .map((r) => r.collection) as Collection[];

  const p_options = rows
    .filter((r) => r.option !== null)
    .filter(
      (r, i, self) =>
        self.findIndex((s) => s.option!.id === r.option!.id) === i,
    )
    .map((r) => ({
      ...r.option,
      values: rows
        .filter((v) => v.optionValue !== null)
        .filter((v) => v.optionValue!.optionId === r.option!.id)
        .filter(
          (v, i, self) =>
            self.findIndex((s) => s.optionValue!.id === v.optionValue!.id) ===
            i,
        )
        .map((v) => v.optionValue) as OptionValue[],
    }));

  const p_variant = rows
    .filter((r) => r.variant !== null)
    .filter(
      (r, i, self) =>
        self.findIndex((s) => s.variant!.id === r.variant!.id) === i,
    )
    .map((r) => ({
      ...r.variant,
      images: rows
        .filter((v) => v.variantImage !== null)
        .filter((v) => v.variantImage!.variantId === r.variant!.id)
        .filter(
          (v, i, self) =>
            self.findIndex((s) => s.variantImage!.id === v.variantImage!.id) ===
            i,
        )
        .filter(
          (v, i, self) =>
            self.findIndex((s) => s.image!.id === v.image!.id) === i,
        )
        .map((v) => v.image) as TImage[],
      options: rows
        .filter((v) => v.variantOption !== null)
        .filter((v) => v.variantOption!.variantId === r.variant!.id)
        .filter(
          (v, i, self) =>
            self.findIndex(
              (s) => s.variantOption!.id === v.variantOption!.id,
            ) === i,
        )
        .map((v) => v.variantOption) as VariantOption[],
    }));

  const p_images = rows
    .filter((r) => r.image !== null)
    .filter(
      (r, i, self) => self.findIndex((s) => s.image!.id === r.image!.id) === i,
    )
    .map((p) => p.image) as TImage[];

  return {
    ...p,
    collections: p_collections,
    options: p_options,
    variants: p_variant,
    images: p_images,
  };
};
