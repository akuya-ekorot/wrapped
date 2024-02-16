import { db } from '@/lib/db/index';
import { and, eq } from 'drizzle-orm';
import {
  CustomerId,
  NewCustomerParams,
  UpdateCustomerParams,
  updateCustomerSchema,
  insertCustomerSchema,
  customers,
  customerIdSchema,
} from '@/lib/db/schema/customers';
import { getUserAuth } from '@/lib/auth/utils';

export const setLocalCustomer = async (customerId: string) => {
  localStorage.setItem('customer', JSON.stringify(customerId));
};

export const createCustomer = async (customerAddress: NewCustomerParams) => {
  const { session } = await getUserAuth();
  const newCustomer = insertCustomerSchema.parse({
    ...customerAddress,
    userId: session?.user.id!,
  });
  try {
    const [c] = await db.insert(customers).values(newCustomer).returning();
    return { customer: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateCustomer = async (
  id: CustomerId,
  customerAddress: UpdateCustomerParams,
) => {
  const { id: customerId } = customerIdSchema.parse({ id });
  const newCustomer = updateCustomerSchema.parse({
    ...customerAddress,
  });

  try {
    const [c] = await db
      .update(customers)
      .set({ ...newCustomer, updatedAt: new Date() })
      .where(and(eq(customers.id, customerId!)))
      .returning();
    return { customer: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteCustomer = async (id: CustomerId) => {
  const { id: customerAddressId } = customerIdSchema.parse({ id });
  try {
    const [c] = await db
      .delete(customers)
      .where(and(eq(customers.id, customerAddressId!)))
      .returning();
    return { customer: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
