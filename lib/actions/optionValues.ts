'use server';

import { revalidatePath } from 'next/cache';
import {
  createOptionValue,
  deleteOptionValue,
  updateOptionValue,
} from '@/lib/api/optionValues/mutations';
import {
  OptionValueId,
  NewOptionValueParams,
  UpdateOptionValueParams,
  optionValueIdSchema,
  insertOptionValueParams,
  updateOptionValueParams,
} from '@/lib/db/schema/optionValues';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateOptionValues = () => revalidatePath('/option-values');

export const createOptionValueAction = async (input: NewOptionValueParams) => {
  try {
    const payload = insertOptionValueParams.parse(input);
    await createOptionValue(payload);
    revalidateOptionValues();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateOptionValueAction = async (
  input: UpdateOptionValueParams,
) => {
  try {
    const payload = updateOptionValueParams.parse(input);
    await updateOptionValue(payload.id, payload);
    revalidateOptionValues();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteOptionValueAction = async (input: OptionValueId) => {
  try {
    const payload = optionValueIdSchema.parse({ id: input });
    await deleteOptionValue(payload.id);
    revalidateOptionValues();
  } catch (e) {
    return handleErrors(e);
  }
};
