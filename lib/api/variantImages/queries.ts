import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type VariantImageId,
  variantImageIdSchema,
  variantImages,
} from '@/lib/db/schema/variantImages';
import { productImages } from '@/lib/db/schema/productImages';
import { variants } from '@/lib/db/schema/variants';
import { images } from '@/lib/db/schema/images';

export const getVariantImages = async () => {
  const rows = await db
    .select({
      variantImage: variantImages,
      productImage: productImages,
      variant: variants,
      image: images,
    })
    .from(variantImages)
    .leftJoin(productImages, eq(variantImages.productImageId, productImages.id))
    .leftJoin(images, eq(productImages.imageId, images.id))
    .leftJoin(variants, eq(variantImages.variantId, variants.id));

  const v = rows.map((r) => ({
    ...r.variantImage,
    image: r.image,
    productImage: r.productImage,
    variant: r.variant,
  }));
  return { variantImages: v };
};

export const getVariantImageById = async (id: VariantImageId) => {
  const { id: variantImageId } = variantImageIdSchema.parse({ id });
  const [row] = await db
    .select({
      variantImage: variantImages,
      productImage: productImages,
      variant: variants,
    })
    .from(variantImages)
    .where(eq(variantImages.id, variantImageId))
    .leftJoin(productImages, eq(variantImages.productImageId, productImages.id))
    .leftJoin(variants, eq(variantImages.variantId, variants.id));
  if (row === undefined) return {};
  const v = {
    ...row.variantImage,
    productImage: row.productImage,
    variant: row.variant,
  };
  return { variantImage: v };
};
