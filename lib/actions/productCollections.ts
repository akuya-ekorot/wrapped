"use server";

import { revalidatePath } from "next/cache";
import {
  createProductCollection,
  deleteProductCollection,
  updateProductCollection,
} from "@/lib/api/productCollections/mutations";
import {
  ProductCollectionId,
  NewProductCollectionParams,
  UpdateProductCollectionParams,
  productCollectionIdSchema,
  insertProductCollectionParams,
  updateProductCollectionParams,
} from "@/lib/db/schema/productCollections";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateProductCollections = () => revalidatePath("/product-collections");

export const createProductCollectionAction = async (input: NewProductCollectionParams) => {
  try {
    const payload = insertProductCollectionParams.parse(input);
    await createProductCollection(payload);
    revalidateProductCollections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateProductCollectionAction = async (input: UpdateProductCollectionParams) => {
  try {
    const payload = updateProductCollectionParams.parse(input);
    await updateProductCollection(payload.id, payload);
    revalidateProductCollections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteProductCollectionAction = async (input: ProductCollectionId) => {
  try {
    const payload = productCollectionIdSchema.parse({ id: input });
    await deleteProductCollection(payload.id);
    revalidateProductCollections();
  } catch (e) {
    return handleErrors(e);
  }
};