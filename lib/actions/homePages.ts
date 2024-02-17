'use server';

import { revalidatePath } from 'next/cache';
import {
  createHomePage,
  deleteHomePage,
  updateHomePage,
} from '@/lib/api/homePages/mutations';
import {
  HomePageId,
  NewHomePageParams,
  UpdateHomePageParams,
  homePageIdSchema,
  insertHomePageParams,
  updateHomePageParams,
} from '@/lib/db/schema/homePages';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateHomePages = () => revalidatePath('/home-pages');

export const createHomePageAction = async (input: NewHomePageParams) => {
  try {
    const payload = insertHomePageParams.parse(input);
    await createHomePage(payload);
    revalidateHomePages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateHomePageAction = async (input: UpdateHomePageParams) => {
  try {
    const payload = updateHomePageParams.parse(input);
    await updateHomePage(payload.id, payload);
    revalidateHomePages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteHomePageAction = async (input: HomePageId) => {
  try {
    const payload = homePageIdSchema.parse({ id: input });
    await deleteHomePage(payload.id);
    revalidateHomePages();
  } catch (e) {
    return handleErrors(e);
  }
};
