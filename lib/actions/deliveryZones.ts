'use server';

import { revalidatePath } from 'next/cache';
import {
  createDeliveryZone,
  deleteDeliveryZone,
  updateDeliveryZone,
} from '@/lib/api/deliveryZones/mutations';
import {
  DeliveryZoneId,
  NewDeliveryZoneParams,
  UpdateDeliveryZoneParams,
  deliveryZoneIdSchema,
  insertDeliveryZoneParams,
  updateDeliveryZoneParams,
} from '@/lib/db/schema/deliveryZones';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateDeliveryZones = () => revalidatePath('/delivery-zones');

export const createDeliveryZoneAction = async (
  input: NewDeliveryZoneParams,
) => {
  try {
    const payload = insertDeliveryZoneParams.parse(input);
    await createDeliveryZone(payload);
    revalidateDeliveryZones();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateDeliveryZoneAction = async (
  input: UpdateDeliveryZoneParams,
) => {
  try {
    const payload = updateDeliveryZoneParams.parse(input);
    await updateDeliveryZone(payload.id, payload);
    revalidateDeliveryZones();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteDeliveryZoneAction = async (input: DeliveryZoneId) => {
  try {
    const payload = deliveryZoneIdSchema.parse({ id: input });
    await deleteDeliveryZone(payload.id);
    revalidateDeliveryZones();
  } catch (e) {
    return handleErrors(e);
  }
};
