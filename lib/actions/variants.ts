"use server";

import { revalidatePath } from "next/cache";
import {
  createVariant,
  deleteVariant,
  updateVariant,
} from "@/lib/api/variants/mutations";
import {
  VariantId,
  NewVariantParams,
  UpdateVariantParams,
  variantIdSchema,
  insertVariantParams,
  updateVariantParams,
} from "@/lib/db/schema/variants";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateVariants = () => revalidatePath("/variants");

export const createVariantAction = async (input: NewVariantParams) => {
  try {
    const payload = insertVariantParams.parse(input);
    await createVariant(payload);
    revalidateVariants();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateVariantAction = async (input: UpdateVariantParams) => {
  try {
    const payload = updateVariantParams.parse(input);
    await updateVariant(payload.id, payload);
    revalidateVariants();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteVariantAction = async (input: VariantId) => {
  try {
    const payload = variantIdSchema.parse({ id: input });
    await deleteVariant(payload.id);
    revalidateVariants();
  } catch (e) {
    return handleErrors(e);
  }
};