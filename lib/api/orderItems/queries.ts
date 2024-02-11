import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type OrderItemId, orderItemIdSchema, orderItems } from "@/lib/db/schema/orderItems";
import { variants } from "@/lib/db/schema/variants";
import { orders } from "@/lib/db/schema/orders";

export const getOrderItems = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ orderItem: orderItems, variant: variants, order: orders }).from(orderItems).leftJoin(variants, eq(orderItems.variantId, variants.id)).leftJoin(orders, eq(orderItems.orderId, orders.id)).where(eq(orderItems.userId, session?.user.id!));
  const o = rows .map((r) => ({ ...r.orderItem, variant: r.variant, order: r.order})); 
  return { orderItems: o };
};

export const getOrderItemById = async (id: OrderItemId) => {
  const { session } = await getUserAuth();
  const { id: orderItemId } = orderItemIdSchema.parse({ id });
  const [row] = await db.select({ orderItem: orderItems, variant: variants, order: orders }).from(orderItems).where(and(eq(orderItems.id, orderItemId), eq(orderItems.userId, session?.user.id!))).leftJoin(variants, eq(orderItems.variantId, variants.id)).leftJoin(orders, eq(orderItems.orderId, orders.id));
  if (row === undefined) return {};
  const o =  { ...row.orderItem, variant: row.variant, order: row.order } ;
  return { orderItem: o };
};


