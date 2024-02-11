'use server';

import { revalidatePath } from 'next/cache';
import { createTag, deleteTag, updateTag } from '@/lib/api/tags/mutations';
import {
  TagId,
  NewTagParams,
  UpdateTagParams,
  tagIdSchema,
  insertTagParams,
  updateTagParams,
} from '@/lib/db/schema/tags';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateTags = () => revalidatePath('/tags');

export const createTagAction = async (input: NewTagParams) => {
  try {
    const payload = insertTagParams.parse(input);
    await createTag(payload);
    revalidateTags();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateTagAction = async (input: UpdateTagParams) => {
  try {
    const payload = updateTagParams.parse(input);
    await updateTag(payload.id, payload);
    revalidateTags();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteTagAction = async (input: TagId) => {
  try {
    const payload = tagIdSchema.parse({ id: input });
    await deleteTag(payload.id);
    revalidateTags();
  } catch (e) {
    return handleErrors(e);
  }
};
