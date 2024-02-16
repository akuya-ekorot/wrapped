import { db } from '@/lib/db/index';
import { eq, and } from 'drizzle-orm';
import { getUserAuth } from '@/lib/auth/utils';
import {
  type CustomerAddressId,
  customerAddressIdSchema,
  customerAddresses,
} from '@/lib/db/schema/customerAddresses';

export const getCustomerAddresses = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ customerAddress: customerAddresses })
    .from(customerAddresses)
    .where(eq(customerAddresses.userId, session?.user.id!));

  const c = rows.map((r) => ({
    ...r.customerAddress,
  }));

  return { customerAddresses: c };
};

export const getCustomerAddressById = async (id: CustomerAddressId) => {
  const { session } = await getUserAuth();
  const { id: customerAddressId } = customerAddressIdSchema.parse({ id });
  const [row] = await db
    .select({ customerAddress: customerAddresses })
    .from(customerAddresses)
    .where(
      and(
        eq(customerAddresses.id, customerAddressId),
        eq(customerAddresses.userId, session?.user.id!),
      ),
    );

  if (row === undefined) return {};

  const c = { ...row.customerAddress };

  return { customerAddress: c };
};
