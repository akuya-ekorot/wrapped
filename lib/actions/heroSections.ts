'use server';

import { revalidatePath } from 'next/cache';
import {
  createHeroSection,
  deleteHeroSection,
  updateHeroSection,
} from '@/lib/api/heroSections/mutations';
import {
  HeroSectionId,
  NewHeroSectionParams,
  UpdateHeroSectionParams,
  heroSectionIdSchema,
  insertHeroSectionParams,
  updateHeroSectionParams,
} from '@/lib/db/schema/heroSections';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateHeroSections = () => revalidatePath('/hero-sections');

export const createHeroSectionAction = async (input: NewHeroSectionParams) => {
  try {
    const payload = insertHeroSectionParams.parse(input);
    await createHeroSection(payload);
    revalidateHeroSections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateHeroSectionAction = async (
  input: UpdateHeroSectionParams,
) => {
  try {
    const payload = updateHeroSectionParams.parse(input);
    await updateHeroSection(payload.id, payload);
    revalidateHeroSections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteHeroSectionAction = async (input: HeroSectionId) => {
  try {
    const payload = heroSectionIdSchema.parse({ id: input });
    await deleteHeroSection(payload.id);
    revalidateHeroSections();
  } catch (e) {
    return handleErrors(e);
  }
};
