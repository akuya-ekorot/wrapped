'use server';

import { revalidatePath } from 'next/cache';
import {
  createLinkToProduct,
  deleteLinkToProduct,
  updateLinkToProduct,
} from '@/lib/api/linkToProducts/mutations';
import {
  LinkToProductId,
  NewLinkToProductParams,
  UpdateLinkToProductParams,
  linkToProductIdSchema,
  insertLinkToProductParams,
  updateLinkToProductParams,
} from '@/lib/db/schema/linkToProducts';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateLinkToProducts = () => revalidatePath('/link-to-products');

export const createLinkToProductAction = async (
  input: NewLinkToProductParams,
) => {
  try {
    const payload = insertLinkToProductParams.parse(input);
    await createLinkToProduct(payload);
    revalidateLinkToProducts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLinkToProductAction = async (
  input: UpdateLinkToProductParams,
) => {
  try {
    const payload = updateLinkToProductParams.parse(input);
    await updateLinkToProduct(payload.id, payload);
    revalidateLinkToProducts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLinkToProductAction = async (input: LinkToProductId) => {
  try {
    const payload = linkToProductIdSchema.parse({ id: input });
    await deleteLinkToProduct(payload.id);
    revalidateLinkToProducts();
  } catch (e) {
    return handleErrors(e);
  }
};
