'use server';

import { revalidatePath } from 'next/cache';
import {
  createReferredProduct,
  deleteReferredProduct,
  updateReferredProduct,
} from '@/lib/api/referredProducts/mutations';
import {
  ReferredProductId,
  NewReferredProductParams,
  UpdateReferredProductParams,
  referredProductIdSchema,
  insertReferredProductParams,
  updateReferredProductParams,
} from '@/lib/db/schema/referredProducts';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateReferredProducts = () => revalidatePath('/referred-products');

export const createReferredProductAction = async (
  input: NewReferredProductParams,
) => {
  try {
    const payload = insertReferredProductParams.parse(input);
    await createReferredProduct(payload);
    revalidateReferredProducts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateReferredProductAction = async (
  input: UpdateReferredProductParams,
) => {
  try {
    const payload = updateReferredProductParams.parse(input);
    await updateReferredProduct(payload.id, payload);
    revalidateReferredProducts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteReferredProductAction = async (input: ReferredProductId) => {
  try {
    const payload = referredProductIdSchema.parse({ id: input });
    await deleteReferredProduct(payload.id);
    revalidateReferredProducts();
  } catch (e) {
    return handleErrors(e);
  }
};
