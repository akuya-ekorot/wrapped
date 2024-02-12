import { db } from '@/lib/db/index';
import { eq, and } from 'drizzle-orm';
import { getUserAuth } from '@/lib/auth/utils';
import { type OrderId, orderIdSchema, orders } from '@/lib/db/schema/orders';
import { deliveryZones } from '@/lib/db/schema/deliveryZones';
import { orderItems, type CompleteOrderItem } from '@/lib/db/schema/orderItems';
import { users } from '@/lib/db/schema/auth';
import { variants } from '@/lib/db/schema/variants';

export const getOrders = async () => {
  const { session } = await getUserAuth();

  const rows = await db
    .select({ order: orders, deliveryZone: deliveryZones, user: users })
    .from(orders)
    .leftJoin(deliveryZones, eq(orders.deliveryZoneId, deliveryZones.id))
    .leftJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.userId, session?.user.id!));

  const o = rows.map((r) => ({
    ...r.order,
    deliveryZone: r.deliveryZone,
    user: r.user,
  }));

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
    .select({ order: orders, orderItem: orderItems, variant: variants })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, session?.user.id!)))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .leftJoin(variants, eq(orderItems.variantId, variants.id));

  if (rows.length === 0) return {};

  const o = rows[0].order;

  const oo = rows
    .filter((r) => r.orderItem !== null)
    .filter(
      (r, i, a) =>
        a.findIndex((rr) => rr.orderItem!.id === r.orderItem!.id) === i,
    )
    .map((o) => ({
      ...o.orderItem,
      variant: o.variant,
    })) as CompleteOrderItem[];

  return { order: o, orderItems: oo };
};
