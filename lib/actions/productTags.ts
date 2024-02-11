'use server';

import { revalidatePath } from 'next/cache';
import {
  createProductTag,
  deleteProductTag,
  updateProductTag,
} from '@/lib/api/productTags/mutations';
import {
  ProductTagId,
  NewProductTagParams,
  UpdateProductTagParams,
  productTagIdSchema,
  insertProductTagParams,
  updateProductTagParams,
} from '@/lib/db/schema/productTags';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateProductTags = () => revalidatePath('/product-tags');

export const createProductTagAction = async (input: NewProductTagParams) => {
  try {
    const payload = insertProductTagParams.parse(input);
    await createProductTag(payload);
    revalidateProductTags();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateProductTagAction = async (input: UpdateProductTagParams) => {
  try {
    const payload = updateProductTagParams.parse(input);
    await updateProductTag(payload.id, payload);
    revalidateProductTags();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteProductTagAction = async (input: ProductTagId) => {
  try {
    const payload = productTagIdSchema.parse({ id: input });
    await deleteProductTag(payload.id);
    revalidateProductTags();
  } catch (e) {
    return handleErrors(e);
  }
};
