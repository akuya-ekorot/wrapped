import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  ProductCollectionId, 
  NewProductCollectionParams,
  UpdateProductCollectionParams, 
  updateProductCollectionSchema,
  insertProductCollectionSchema, 
  productCollections,
  productCollectionIdSchema 
} from "@/lib/db/schema/productCollections";

export const createProductCollection = async (productCollection: NewProductCollectionParams) => {
  const newProductCollection = insertProductCollectionSchema.parse(productCollection);
  try {
    const [p] =  await db.insert(productCollections).values(newProductCollection).returning();
    return { productCollection: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateProductCollection = async (id: ProductCollectionId, productCollection: UpdateProductCollectionParams) => {
  const { id: productCollectionId } = productCollectionIdSchema.parse({ id });
  const newProductCollection = updateProductCollectionSchema.parse(productCollection);
  try {
    const [p] =  await db
     .update(productCollections)
     .set({...newProductCollection, updatedAt: new Date() })
     .where(eq(productCollections.id, productCollectionId!))
     .returning();
    return { productCollection: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteProductCollection = async (id: ProductCollectionId) => {
  const { id: productCollectionId } = productCollectionIdSchema.parse({ id });
  try {
    const [p] =  await db.delete(productCollections).where(eq(productCollections.id, productCollectionId!))
    .returning();
    return { productCollection: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

