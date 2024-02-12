'use server';

import { revalidatePath } from 'next/cache';
import {
  createLinkToCollection,
  deleteLinkToCollection,
  updateLinkToCollection,
} from '@/lib/api/linkToCollections/mutations';
import {
  LinkToCollectionId,
  NewLinkToCollectionParams,
  UpdateLinkToCollectionParams,
  linkToCollectionIdSchema,
  insertLinkToCollectionParams,
  updateLinkToCollectionParams,
} from '@/lib/db/schema/linkToCollections';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateLinkToCollections = () =>
  revalidatePath('/link-to-collections');

export const createLinkToCollectionAction = async (
  input: NewLinkToCollectionParams,
) => {
  try {
    const payload = insertLinkToCollectionParams.parse(input);
    await createLinkToCollection(payload);
    revalidateLinkToCollections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLinkToCollectionAction = async (
  input: UpdateLinkToCollectionParams,
) => {
  try {
    const payload = updateLinkToCollectionParams.parse(input);
    await updateLinkToCollection(payload.id, payload);
    revalidateLinkToCollections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLinkToCollectionAction = async (
  input: LinkToCollectionId,
) => {
  try {
    const payload = linkToCollectionIdSchema.parse({ id: input });
    await deleteLinkToCollection(payload.id);
    revalidateLinkToCollections();
  } catch (e) {
    return handleErrors(e);
  }
};
