import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type CollectionImageId, collectionImageIdSchema, collectionImages } from "@/lib/db/schema/collectionImages";
import { images } from "@/lib/db/schema/images";
import { collections } from "@/lib/db/schema/collections";

export const getCollectionImages = async () => {
  const rows = await db.select({ collectionImage: collectionImages, image: images, collection: collections }).from(collectionImages).leftJoin(images, eq(collectionImages.imageId, images.id)).leftJoin(collections, eq(collectionImages.collectionId, collections.id));
  const c = rows .map((r) => ({ ...r.collectionImage, image: r.image, collection: r.collection})); 
  return { collectionImages: c };
};

export const getCollectionImageById = async (id: CollectionImageId) => {
  const { id: collectionImageId } = collectionImageIdSchema.parse({ id });
  const [row] = await db.select({ collectionImage: collectionImages, image: images, collection: collections }).from(collectionImages).where(eq(collectionImages.id, collectionImageId)).leftJoin(images, eq(collectionImages.imageId, images.id)).leftJoin(collections, eq(collectionImages.collectionId, collections.id));
  if (row === undefined) return {};
  const c =  { ...row.collectionImage, image: row.image, collection: row.collection } ;
  return { collectionImage: c };
};


