'use server';

import { revalidatePath } from 'next/cache';
import {
  createHeroLink,
  deleteHeroLink,
  updateHeroLink,
} from '@/lib/api/heroLinks/mutations';
import {
  HeroLinkId,
  NewHeroLinkParams,
  UpdateHeroLinkParams,
  heroLinkIdSchema,
  insertHeroLinkParams,
  updateHeroLinkParams,
} from '@/lib/db/schema/heroLinks';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateHeroLinks = () => revalidatePath('/hero-links');

export const createHeroLinkAction = async (input: NewHeroLinkParams) => {
  try {
    const payload = insertHeroLinkParams.parse(input);
    await createHeroLink(payload);
    revalidateHeroLinks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateHeroLinkAction = async (input: UpdateHeroLinkParams) => {
  try {
    const payload = updateHeroLinkParams.parse(input);
    await updateHeroLink(payload.id, payload);
    revalidateHeroLinks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteHeroLinkAction = async (input: HeroLinkId) => {
  try {
    const payload = heroLinkIdSchema.parse({ id: input });
    await deleteHeroLink(payload.id);
    revalidateHeroLinks();
  } catch (e) {
    return handleErrors(e);
  }
};
