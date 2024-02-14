"use server";

import { revalidatePath } from "next/cache";
import {
  createVariantImage,
  deleteVariantImage,
  updateVariantImage,
} from "@/lib/api/variantImages/mutations";
import {
  VariantImageId,
  NewVariantImageParams,
  UpdateVariantImageParams,
  variantImageIdSchema,
  insertVariantImageParams,
  updateVariantImageParams,
} from "@/lib/db/schema/variantImages";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateVariantImages = () => revalidatePath("/variant-images");

export const createVariantImageAction = async (input: NewVariantImageParams) => {
  try {
    const payload = insertVariantImageParams.parse(input);
    await createVariantImage(payload);
    revalidateVariantImages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateVariantImageAction = async (input: UpdateVariantImageParams) => {
  try {
    const payload = updateVariantImageParams.parse(input);
    await updateVariantImage(payload.id, payload);
    revalidateVariantImages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteVariantImageAction = async (input: VariantImageId) => {
  try {
    const payload = variantImageIdSchema.parse({ id: input });
    await deleteVariantImage(payload.id);
    revalidateVariantImages();
  } catch (e) {
    return handleErrors(e);
  }
};