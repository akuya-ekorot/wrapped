import { db } from '@/lib/db/index';
import { eq, and, gte, lte, count, sum } from 'drizzle-orm';
import {
  type OrderId,
  orderIdSchema,
  orders,
  type TOrderStatus,
  getTotalOrdersSchema,
  OrderStatus,
} from '@/lib/db/schema/orders';
import { deliveryZones } from '@/lib/db/schema/deliveryZones';
import { orderItems, type CompleteOrderItem } from '@/lib/db/schema/orderItems';
import { variants } from '@/lib/db/schema/variants';
import { customers } from '@/lib/db/schema/customers';
import { products } from '@/lib/db/schema/products';
import { PgSelect } from 'drizzle-orm/pg-core';
import { DateTime } from 'luxon';

function withStatus<T extends PgSelect>(query: T, status: OrderStatus) {
  return query.where(eq(orders.status, status));
}

export const getPercentageChange = async (params?: {
  status?: TOrderStatus;
  start?: Date;
  end?: Date;
}) => {
  const parsedParams = getTotalOrdersSchema.parse(params);

  const currentStart = DateTime.fromJSDate(
    parsedParams?.start ?? DateTime.now().startOf('day').toJSDate(),
  );
  const currentEnd = DateTime.fromJSDate(
    parsedParams?.end ?? currentStart.endOf('day').toJSDate(),
  );

  const currentDuration = currentEnd.diff(currentStart, 'days').toObject();
  const previousDuration = currentStart
    .diff(currentStart.minus(currentDuration), 'days')
    .toObject();

  const previousStart = currentStart.minus(previousDuration).toJSDate();
  const previousEnd = currentStart.toJSDate();

  const { totalRevenue: previousTotalRevenue } = await getTotalOrderRevenue({
    start: previousStart,
    end: previousEnd,
    status: params?.status,
  });

  const { totalRevenue: currentTotalRevenue } = await getTotalOrderRevenue({
    start: parsedParams?.start,
    end: parsedParams?.end,
    status: params?.status,
  });

  if (previousTotalRevenue === null) return { percentageChange: null };
  if (currentTotalRevenue === null) return { percentageChange: null };

  const percentageChange =
    ((parseFloat(currentTotalRevenue) - parseFloat(previousTotalRevenue)) /
      parseFloat(previousTotalRevenue)) *
    100;

  return { percentageChange };
};

export const getTotalOrderRevenue = async (params?: {
  status?: TOrderStatus;
  start?: Date;
  end?: Date;
}) => {
  const parsedParams = getTotalOrdersSchema.parse(params);
  let query = db
    .select({ totalRevenue: sum(orders.amount) })
    .from(orders)
    .$dynamic();

  if (parsedParams?.status) {
    query = withStatus(query, parsedParams.status);
  }

  if (parsedParams?.start && parsedParams?.end) {
    query = query.where(
      and(
        lte(orders.createdAt, parsedParams.end),
        gte(orders.createdAt, parsedParams.start),
      ),
    );
  } else if (parsedParams?.start) {
    query = query.where(gte(orders.createdAt, parsedParams.start));
  } else if (parsedParams?.end) {
    query = query.where(lte(orders.createdAt, parsedParams.end));
  }

  const [row] = await query;

  return row;
};

export const getOrdersTotal = async () => {
  const rows = await db
    .select({ orders: orders })
    .from(orders)
    .where(eq(orders.status, 'payment_paid'));

  const total = rows.reduce((acc, row) => acc + row.orders.amount, 0);
  const numOrders = rows.length;

  return { total, numOrders };
};

export const getOrders = async () => {
  const rows = await db
    .select({ order: orders, deliveryZone: deliveryZones, customer: customers })
    .from(orders)
    .leftJoin(deliveryZones, eq(orders.deliveryZoneId, deliveryZones.id))
    .leftJoin(customers, eq(orders.customerId, customers.id));

  const o = rows.map((r) => ({
    ...r.order,
    deliveryZone: r.deliveryZone,
    customer: r.customer,
  }));

  return { orders: o };
};

export const getOrderById = async (id: OrderId) => {
  const { id: orderId } = orderIdSchema.parse({ id });
  const [row] = await db
    .select({ order: orders, deliveryZone: deliveryZones, customer: customers })
    .from(orders)
    .where(and(eq(orders.id, orderId)))
    .leftJoin(deliveryZones, eq(orders.deliveryZoneId, deliveryZones.id))
    .leftJoin(customers, eq(orders.customerId, customers.id));

  if (row === undefined) return {};
  const o = { ...row.order, deliveryZone: row.deliveryZone };
  return { order: o };
};

export const getOrderByIdWithOrderItems = async (id: OrderId) => {
  const { id: orderId } = orderIdSchema.parse({ id });

  const rows = await db
    .select({
      order: orders,
      orderItem: orderItems,
      variant: variants,
      product: products,
    })
    .from(orders)
    .where(and(eq(orders.id, orderId)))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .leftJoin(products, eq(orderItems.productId, products.id))
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
      product: o.product,
    })) as CompleteOrderItem[];

  return { order: o, orderItems: oo };
};
