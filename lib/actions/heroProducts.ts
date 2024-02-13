'use server';

import { revalidatePath } from 'next/cache';
import {
  createHeroProduct,
  deleteHeroProduct,
  updateHeroProduct,
} from '@/lib/api/heroProducts/mutations';
import {
  HeroProductId,
  NewHeroProductParams,
  UpdateHeroProductParams,
  heroProductIdSchema,
  insertHeroProductParams,
  updateHeroProductParams,
} from '@/lib/db/schema/heroProducts';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateHeroProducts = () => revalidatePath('/hero-products');

export const createHeroProductAction = async (input: NewHeroProductParams) => {
  try {
    const payload = insertHeroProductParams.parse(input);
    await createHeroProduct(payload);
    revalidateHeroProducts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateHeroProductAction = async (
  input: UpdateHeroProductParams,
) => {
  try {
    const payload = updateHeroProductParams.parse(input);
    await updateHeroProduct(payload.id, payload);
    revalidateHeroProducts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteHeroProductAction = async (input: HeroProductId) => {
  try {
    const payload = heroProductIdSchema.parse({ id: input });
    await deleteHeroProduct(payload.id);
    revalidateHeroProducts();
  } catch (e) {
    return handleErrors(e);
  }
};
