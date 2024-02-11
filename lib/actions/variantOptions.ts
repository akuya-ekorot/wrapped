'use server';

import { revalidatePath } from 'next/cache';
import {
  createVariantOption,
  deleteVariantOption,
  updateVariantOption,
} from '@/lib/api/variantOptions/mutations';
import {
  VariantOptionId,
  NewVariantOptionParams,
  UpdateVariantOptionParams,
  variantOptionIdSchema,
  insertVariantOptionParams,
  updateVariantOptionParams,
} from '@/lib/db/schema/variantOptions';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateVariantOptions = () => revalidatePath('/variant-options');

export const createVariantOptionAction = async (
  input: NewVariantOptionParams,
) => {
  try {
    const payload = insertVariantOptionParams.parse(input);
    await createVariantOption(payload);
    revalidateVariantOptions();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateVariantOptionAction = async (
  input: UpdateVariantOptionParams,
) => {
  try {
    const payload = updateVariantOptionParams.parse(input);
    await updateVariantOption(payload.id, payload);
    revalidateVariantOptions();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteVariantOptionAction = async (input: VariantOptionId) => {
  try {
    const payload = variantOptionIdSchema.parse({ id: input });
    await deleteVariantOption(payload.id);
    revalidateVariantOptions();
  } catch (e) {
    return handleErrors(e);
  }
};
