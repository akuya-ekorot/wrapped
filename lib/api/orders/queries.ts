import { db } from '@/lib/db/index';
import { eq, and, gte, lte, count, sum } from 'drizzle-orm';
import {
  type OrderId,
  orderIdSchema,
  orders,
  getTotalOrdersSchema,
  OrderStatus,
  AllStatus,
} from '@/lib/db/schema/orders';
import { deliveryZones } from '@/lib/db/schema/deliveryZones';
import { orderItems, type CompleteOrderItem } from '@/lib/db/schema/orderItems';
import { variants } from '@/lib/db/schema/variants';
import { customers } from '@/lib/db/schema/customers';
import { products } from '@/lib/db/schema/products';
import { DateTime } from 'luxon';

export const getPercentageChange = async (params?: {
  status?: OrderStatus | AllStatus;
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

  const {
    totalOrderRevenue: previousTotalRevenue,
    totalOrderCount: previousOrderCount,
    totalCustomerCount: previousCustomerCount,
  } = await getTotals({
    start: previousStart,
    end: previousEnd,
    status: parsedParams?.status,
  });

  const {
    totalOrderRevenue: currentTotalRevenue,
    totalOrderCount: currentOrderCount,
    totalCustomerCount: currentCustomerCount,
  } = await getTotals({
    start: parsedParams?.start,
    end: parsedParams?.end,
    status: parsedParams?.status,
  });

  const revenuePercentageChange =
    ((parseFloat(currentTotalRevenue ?? '0') -
      parseFloat(previousTotalRevenue ?? '0')) /
      parseFloat(previousTotalRevenue ?? '0')) *
    100;

  const orderPercentageChange =
    (((currentOrderCount ?? '0') - (previousOrderCount ?? '0')) /
      (previousOrderCount ?? '0')) *
    100;

  const customerPercentageChange =
    (((currentCustomerCount ?? '0') - (previousCustomerCount ?? '0')) /
      (previousCustomerCount ?? '0')) *
    100;

  return {
    revenuePercentageChange,
    orderPercentageChange,
    customerPercentageChange,
  };
};

export const getTotals = async (params?: {
  status?: OrderStatus | AllStatus;
  start?: Date;
  end?: Date;
}) => {
  const parsedParams = getTotalOrdersSchema.parse(params);

  let query = db
    .select({
      totalOrderRevenue: sum(orders.amount),
      totalOrderCount: count(orders.amount),
      totalCustomerCount: count(customers.id),
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .$dynamic();

  const qb = [];

  if (parsedParams?.status && parsedParams.status !== AllStatus.All) {
    qb.push(eq(orders.status, parsedParams.status));
  }

  if (parsedParams?.start && parsedParams?.end) {
    qb.push(
      and(
        gte(orders.createdAt, parsedParams.start),
        lte(orders.createdAt, parsedParams.end),
      ),
    );
  } else if (parsedParams?.start) {
    qb.push(gte(orders.createdAt, parsedParams.start));
  } else if (parsedParams?.end) {
    qb.push(lte(orders.createdAt, parsedParams.end));
  }

  console.log(query.where(and(...qb)).toSQL());

  const [row] = await query.where(and(...qb));

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
