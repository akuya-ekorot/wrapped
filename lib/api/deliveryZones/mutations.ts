import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  DeliveryZoneId,
  NewDeliveryZoneParams,
  UpdateDeliveryZoneParams,
  updateDeliveryZoneSchema,
  insertDeliveryZoneSchema,
  deliveryZones,
  deliveryZoneIdSchema,
} from '@/lib/db/schema/deliveryZones';

export const createDeliveryZone = async (
  deliveryZone: NewDeliveryZoneParams,
) => {
  const newDeliveryZone = insertDeliveryZoneSchema.parse(deliveryZone);
  try {
    const [d] = await db
      .insert(deliveryZones)
      .values(newDeliveryZone)
      .returning();
    return { deliveryZone: d };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateDeliveryZone = async (
  id: DeliveryZoneId,
  deliveryZone: UpdateDeliveryZoneParams,
) => {
  const { id: deliveryZoneId } = deliveryZoneIdSchema.parse({ id });
  const newDeliveryZone = updateDeliveryZoneSchema.parse(deliveryZone);
  try {
    const [d] = await db
      .update(deliveryZones)
      .set({ ...newDeliveryZone, updatedAt: new Date() })
      .where(eq(deliveryZones.id, deliveryZoneId!))
      .returning();
    return { deliveryZone: d };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteDeliveryZone = async (id: DeliveryZoneId) => {
  const { id: deliveryZoneId } = deliveryZoneIdSchema.parse({ id });
  try {
    const [d] = await db
      .delete(deliveryZones)
      .where(eq(deliveryZones.id, deliveryZoneId!))
      .returning();
    return { deliveryZone: d };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
