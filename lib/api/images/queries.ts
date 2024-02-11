import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type ImageId, imageIdSchema, images } from "@/lib/db/schema/images";

export const getImages = async () => {
  const rows = await db.select().from(images);
  const i = rows
  return { images: i };
};

export const getImageById = async (id: ImageId) => {
  const { id: imageId } = imageIdSchema.parse({ id });
  const [row] = await db.select().from(images).where(eq(images.id, imageId));
  if (row === undefined) return {};
  const i = row;
  return { image: i };
};


