import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type DeliveryZoneId,
  deliveryZoneIdSchema,
  deliveryZones,
} from '@/lib/db/schema/deliveryZones';

export const getDeliveryZones = async () => {
  const rows = await db.select().from(deliveryZones);
  const d = rows;
  return { deliveryZones: d };
};

export const getDeliveryZoneById = async (id: DeliveryZoneId) => {
  const { id: deliveryZoneId } = deliveryZoneIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(deliveryZones)
    .where(eq(deliveryZones.id, deliveryZoneId));
  if (row === undefined) return {};
  const d = row;
  return { deliveryZone: d };
};
