'use server';

import { revalidatePath } from 'next/cache';
import {
  createFeaturedProductsSection,
  deleteFeaturedProductsSection,
  updateFeaturedProductsSection,
} from '@/lib/api/featuredProductsSection/mutations';
import {
  FeaturedProductsSectionId,
  NewFeaturedProductsSectionParams,
  UpdateFeaturedProductsSectionParams,
  featuredProductsSectionIdSchema,
  insertFeaturedProductsSectionParams,
  updateFeaturedProductsSectionParams,
} from '@/lib/db/schema/featuredProductsSection';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateFeaturedProductsSections = () =>
  revalidatePath('/featured-products-section');

export const createFeaturedProductsSectionAction = async (
  input: NewFeaturedProductsSectionParams,
) => {
  try {
    const payload = insertFeaturedProductsSectionParams.parse(input);
    await createFeaturedProductsSection(payload);
    revalidateFeaturedProductsSections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateFeaturedProductsSectionAction = async (
  input: UpdateFeaturedProductsSectionParams,
) => {
  try {
    const payload = updateFeaturedProductsSectionParams.parse(input);
    await updateFeaturedProductsSection(payload.id, payload);
    revalidateFeaturedProductsSections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteFeaturedProductsSectionAction = async (
  input: FeaturedProductsSectionId,
) => {
  try {
    const payload = featuredProductsSectionIdSchema.parse({ id: input });
    await deleteFeaturedProductsSection(payload.id);
    revalidateFeaturedProductsSections();
  } catch (e) {
    return handleErrors(e);
  }
};
