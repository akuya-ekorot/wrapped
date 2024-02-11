import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  ImageId,
  NewImageParams,
  UpdateImageParams,
  updateImageSchema,
  insertImageSchema,
  images,
  imageIdSchema,
} from '@/lib/db/schema/images';

export const createImage = async (image: NewImageParams) => {
  const newImage = insertImageSchema.parse(image);
  try {
    const [i] = await db.insert(images).values(newImage).returning();
    return { image: i };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateImage = async (id: ImageId, image: UpdateImageParams) => {
  const { id: imageId } = imageIdSchema.parse({ id });
  const newImage = updateImageSchema.parse(image);
  try {
    const [i] = await db
      .update(images)
      .set({ ...newImage, updatedAt: new Date() })
      .where(eq(images.id, imageId!))
      .returning();
    return { image: i };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteImage = async (id: ImageId) => {
  const { id: imageId } = imageIdSchema.parse({ id });
  try {
    const [i] = await db
      .delete(images)
      .where(eq(images.id, imageId!))
      .returning();
    return { image: i };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
