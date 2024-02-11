import { db } from '@/lib/db/index';
import { eq, and } from 'drizzle-orm';
import { getUserAuth } from '@/lib/auth/utils';
import { type OrderId, orderIdSchema, orders } from '@/lib/db/schema/orders';
import { deliveryZones } from '@/lib/db/schema/deliveryZones';
import { orderItems, type CompleteOrderItem } from '@/lib/db/schema/orderItems';

export const getOrders = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ order: orders, deliveryZone: deliveryZones })
    .from(orders)
    .leftJoin(deliveryZones, eq(orders.deliveryZoneId, deliveryZones.id))
    .where(eq(orders.userId, session?.user.id!));
  const o = rows.map((r) => ({ ...r.order, deliveryZone: r.deliveryZone }));
  return { orders: o };
};

export const getOrderById = async (id: OrderId) => {
  const { session } = await getUserAuth();
  const { id: orderId } = orderIdSchema.parse({ id });
  const [row] = await db
    .select({ order: orders, deliveryZone: deliveryZones })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, session?.user.id!)))
    .leftJoin(deliveryZones, eq(orders.deliveryZoneId, deliveryZones.id));
  if (row === undefined) return {};
  const o = { ...row.order, deliveryZone: row.deliveryZone };
  return { order: o };
};

export const getOrderByIdWithOrderItems = async (id: OrderId) => {
  const { session } = await getUserAuth();
  const { id: orderId } = orderIdSchema.parse({ id });
  const rows = await db
    .select({ order: orders, orderItem: orderItems })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, session?.user.id!)))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId));
  if (rows.length === 0) return {};
  const o = rows[0].order;
  const oo = rows
    .filter((r) => r.orderItem !== null)
    .map((o) => o.orderItem) as CompleteOrderItem[];

  return { order: o, orderItems: oo };
};
