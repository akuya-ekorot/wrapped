'use server';

import { revalidatePath } from 'next/cache';
import {
  createReferredCollection,
  deleteReferredCollection,
  updateReferredCollection,
} from '@/lib/api/referredCollections/mutations';
import {
  ReferredCollectionId,
  NewReferredCollectionParams,
  UpdateReferredCollectionParams,
  referredCollectionIdSchema,
  insertReferredCollectionParams,
  updateReferredCollectionParams,
} from '@/lib/db/schema/referredCollections';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateReferredCollections = () =>
  revalidatePath('/referred-collections');

export const createReferredCollectionAction = async (
  input: NewReferredCollectionParams,
) => {
  try {
    const payload = insertReferredCollectionParams.parse(input);
    await createReferredCollection(payload);
    revalidateReferredCollections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateReferredCollectionAction = async (
  input: UpdateReferredCollectionParams,
) => {
  try {
    const payload = updateReferredCollectionParams.parse(input);
    await updateReferredCollection(payload.id, payload);
    revalidateReferredCollections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteReferredCollectionAction = async (
  input: ReferredCollectionId,
) => {
  try {
    const payload = referredCollectionIdSchema.parse({ id: input });
    await deleteReferredCollection(payload.id);
    revalidateReferredCollections();
  } catch (e) {
    return handleErrors(e);
  }
};
