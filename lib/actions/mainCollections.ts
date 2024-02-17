'use server';

import { revalidatePath } from 'next/cache';
import {
  createMainCollection,
  deleteMainCollection,
  updateMainCollection,
} from '@/lib/api/mainCollections/mutations';
import {
  MainCollectionId,
  NewMainCollectionParams,
  UpdateMainCollectionParams,
  mainCollectionIdSchema,
  insertMainCollectionParams,
  updateMainCollectionParams,
} from '@/lib/db/schema/mainCollections';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateMainCollections = () => revalidatePath('/main-collections');

export const createMainCollectionAction = async (
  input: NewMainCollectionParams,
) => {
  try {
    const payload = insertMainCollectionParams.parse(input);
    await createMainCollection(payload);
    revalidateMainCollections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateMainCollectionAction = async (
  input: UpdateMainCollectionParams,
) => {
  try {
    const payload = updateMainCollectionParams.parse(input);
    await updateMainCollection(payload.id, payload);
    revalidateMainCollections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteMainCollectionAction = async (input: MainCollectionId) => {
  try {
    const payload = mainCollectionIdSchema.parse({ id: input });
    await deleteMainCollection(payload.id);
    revalidateMainCollections();
  } catch (e) {
    return handleErrors(e);
  }
};
