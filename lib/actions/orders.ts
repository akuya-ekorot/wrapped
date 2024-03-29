'use server';

import { revalidatePath } from 'next/cache';
import {
  createOrder,
  deleteOrder,
  updateOrder,
} from '@/lib/api/orders/mutations';
import {
  OrderId,
  NewOrderParams,
  UpdateOrderParams,
  orderIdSchema,
  insertOrderParams,
  updateOrderParams,
} from '@/lib/db/schema/orders';
import { getOrdersTotal } from '../api/orders/queries';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateOrders = () => revalidatePath('/orders');

export const getOrdersTotalAction = async () => {
  const { numOrders } = await getOrdersTotal();

  return numOrders;
};

export const createOrderAction = async (input: NewOrderParams) => {
  try {
    const payload = insertOrderParams.parse(input);
    const { order } = await createOrder(payload);
    revalidateOrders();
    return { data: { order }, error: null };
  } catch (e) {
    return { data: null, error: handleErrors(e) };
  }
};

export const updateOrderAction = async (input: UpdateOrderParams) => {
  try {
    const payload = updateOrderParams.parse(input);
    const { order } = await updateOrder(payload.id, payload);
    revalidateOrders();
    return { data: { order }, error: null };
  } catch (e) {
    return { data: null, error: handleErrors(e) };
  }
};

export const deleteOrderAction = async (input: OrderId) => {
  try {
    const payload = orderIdSchema.parse({ id: input });
    await deleteOrder(payload.id);
    revalidateOrders();
  } catch (e) {
    return handleErrors(e);
  }
};
