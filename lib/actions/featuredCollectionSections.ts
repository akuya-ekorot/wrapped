'use server';

import { revalidatePath } from 'next/cache';
import {
  createFeaturedCollectionSection,
  deleteFeaturedCollectionSection,
  updateFeaturedCollectionSection,
} from '@/lib/api/featuredCollectionSections/mutations';
import {
  FeaturedCollectionSectionId,
  NewFeaturedCollectionSectionParams,
  UpdateFeaturedCollectionSectionParams,
  featuredCollectionSectionIdSchema,
  insertFeaturedCollectionSectionParams,
  updateFeaturedCollectionSectionParams,
} from '@/lib/db/schema/featuredCollectionSections';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateFeaturedCollectionSections = () =>
  revalidatePath('/featured-collection-sections');

export const createFeaturedCollectionSectionAction = async (
  input: NewFeaturedCollectionSectionParams,
) => {
  try {
    const payload = insertFeaturedCollectionSectionParams.parse(input);
    await createFeaturedCollectionSection(payload);
    revalidateFeaturedCollectionSections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateFeaturedCollectionSectionAction = async (
  input: UpdateFeaturedCollectionSectionParams,
) => {
  try {
    const payload = updateFeaturedCollectionSectionParams.parse(input);
    await updateFeaturedCollectionSection(payload.id, payload);
    revalidateFeaturedCollectionSections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteFeaturedCollectionSectionAction = async (
  input: FeaturedCollectionSectionId,
) => {
  try {
    const payload = featuredCollectionSectionIdSchema.parse({ id: input });
    await deleteFeaturedCollectionSection(payload.id);
    revalidateFeaturedCollectionSections();
  } catch (e) {
    return handleErrors(e);
  }
};
