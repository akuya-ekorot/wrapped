'use server';

import { revalidatePath } from 'next/cache';
import {
  createHeroCollection,
  deleteHeroCollection,
  updateHeroCollection,
} from '@/lib/api/heroCollections/mutations';
import {
  HeroCollectionId,
  NewHeroCollectionParams,
  UpdateHeroCollectionParams,
  heroCollectionIdSchema,
  insertHeroCollectionParams,
  updateHeroCollectionParams,
} from '@/lib/db/schema/heroCollections';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateHeroCollections = () => revalidatePath('/hero-collections');

export const createHeroCollectionAction = async (
  input: NewHeroCollectionParams,
) => {
  try {
    const payload = insertHeroCollectionParams.parse(input);
    await createHeroCollection(payload);
    revalidateHeroCollections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateHeroCollectionAction = async (
  input: UpdateHeroCollectionParams,
) => {
  try {
    const payload = updateHeroCollectionParams.parse(input);
    await updateHeroCollection(payload.id, payload);
    revalidateHeroCollections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteHeroCollectionAction = async (input: HeroCollectionId) => {
  try {
    const payload = heroCollectionIdSchema.parse({ id: input });
    await deleteHeroCollection(payload.id);
    revalidateHeroCollections();
  } catch (e) {
    return handleErrors(e);
  }
};
