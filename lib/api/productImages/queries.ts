import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type ProductImageId,
  productImageIdSchema,
  productImages,
} from '@/lib/db/schema/productImages';
import { images } from '@/lib/db/schema/images';
import { products } from '@/lib/db/schema/products';

export const getProductImages = async () => {
  const rows = await db
    .select({ productImage: productImages, image: images, product: products })
    .from(productImages)
    .leftJoin(images, eq(productImages.imageId, images.id))
    .leftJoin(products, eq(productImages.productId, products.id));
  const p = rows.map((r) => ({
    ...r.productImage,
    image: r.image,
    product: r.product,
  }));
  return { productImages: p };
};

export const getProductImageById = async (id: ProductImageId) => {
  const { id: productImageId } = productImageIdSchema.parse({ id });
  const [row] = await db
    .select({ productImage: productImages, image: images, product: products })
    .from(productImages)
    .where(eq(productImages.id, productImageId))
    .leftJoin(images, eq(productImages.imageId, images.id))
    .leftJoin(products, eq(productImages.productId, products.id));
  if (row === undefined) return {};
  const p = { ...row.productImage, image: row.image, product: row.product };
  return { productImage: p };
};
