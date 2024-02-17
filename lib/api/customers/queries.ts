'use server';

import { db } from '@/lib/db/index';
import { eq, and } from 'drizzle-orm';
import { getUserAuth } from '@/lib/auth/utils';
import {
  type CustomerId,
  customerIdSchema,
  customers,
  Customer,
} from '@/lib/db/schema/customers';
import { get } from 'http';

export const getCustomers = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ customer: customers })
    .from(customers)
    .where(eq(customers.userId, session?.user.id!));

  const c = rows.map((r) => ({
    ...r.customer,
  }));

  return { customers: c };
};

export const getCustomerById = async (id: CustomerId) => {
  const { id: customerId } = customerIdSchema.parse({ id });
  const [row] = await db
    .select({ customer: customers })
    .from(customers)
    .where(and(eq(customers.id, customerId)));

  if (row === undefined) return {};

  const c = { ...row.customer };

  return { customer: c };
};

export const getLocalStoreCustomerById = async (id: CustomerId) => {
  const { id: customerId } = customerIdSchema.parse({ id });
  if (localStorage === undefined) {
    return null;
  }

  const customer = localStorage.getItem(customerId);

  if (!customer) {
    return null;
  }

  const { customer: dbCustomer } = await getCustomerById(customerId);

  return dbCustomer ?? null;
};
