"use server";

import { revalidatePath } from "next/cache";
import {
  createOption,
  deleteOption,
  updateOption,
} from "@/lib/api/options/mutations";
import {
  OptionId,
  NewOptionParams,
  UpdateOptionParams,
  optionIdSchema,
  insertOptionParams,
  updateOptionParams,
} from "@/lib/db/schema/options";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateOptions = () => revalidatePath("/options");

export const createOptionAction = async (input: NewOptionParams) => {
  try {
    const payload = insertOptionParams.parse(input);
    await createOption(payload);
    revalidateOptions();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateOptionAction = async (input: UpdateOptionParams) => {
  try {
    const payload = updateOptionParams.parse(input);
    await updateOption(payload.id, payload);
    revalidateOptions();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteOptionAction = async (input: OptionId) => {
  try {
    const payload = optionIdSchema.parse({ id: input });
    await deleteOption(payload.id);
    revalidateOptions();
  } catch (e) {
    return handleErrors(e);
  }
};