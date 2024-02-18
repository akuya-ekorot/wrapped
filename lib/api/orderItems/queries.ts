import { db } from '@/lib/db/index';
import { eq, and } from 'drizzle-orm';
import { getUserAuth } from '@/lib/auth/utils';
import {
  type OrderItemId,
  orderItemIdSchema,
  orderItems,
} from '@/lib/db/schema/orderItems';
import { variants } from '@/lib/db/schema/variants';
import { orders } from '@/lib/db/schema/orders';
import { products } from '@/lib/db/schema/products';

export const getOrderItems = async () => {
  const rows = await db
    .select({
      orderItem: orderItems,
      variant: variants,
      order: orders,
      product: products,
    })
    .from(orderItems)
    .leftJoin(variants, eq(orderItems.variantId, variants.id))
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .leftJoin(products, eq(variants.productId, products.id));

  const o = rows.map((r) => ({
    ...r.orderItem,
    variant: r.variant,
    order: r.order,
    product: r.product,
  }));

  console.log(o);

  return { orderItems: o };
};

export const getOrderItemById = async (id: OrderItemId) => {
  const { id: orderItemId } = orderItemIdSchema.parse({ id });
  const [row] = await db
    .select({
      orderItem: orderItems,
      variant: variants,
      order: orders,
      product: products,
    })
    .from(orderItems)
    .where(and(eq(orderItems.id, orderItemId)))
    .leftJoin(variants, eq(orderItems.variantId, variants.id))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(orders, eq(orderItems.orderId, orders.id));

  if (row === undefined) return {};
  const o = {
    ...row.orderItem,
    variant: row.variant,
    order: row.order,
    product: row.product,
  };
  return { orderItem: o };
};
