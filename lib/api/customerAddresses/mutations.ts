import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  CustomerAddressId, 
  NewCustomerAddressParams,
  UpdateCustomerAddressParams, 
  updateCustomerAddressSchema,
  insertCustomerAddressSchema, 
  customerAddresses,
  customerAddressIdSchema 
} from "@/lib/db/schema/customerAddresses";
import { getUserAuth } from "@/lib/auth/utils";

export const createCustomerAddress = async (customerAddress: NewCustomerAddressParams) => {
  const { session } = await getUserAuth();
  const newCustomerAddress = insertCustomerAddressSchema.parse({ ...customerAddress, userId: session?.user.id! });
  try {
    const [c] =  await db.insert(customerAddresses).values(newCustomerAddress).returning();
    return { customerAddress: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCustomerAddress = async (id: CustomerAddressId, customerAddress: UpdateCustomerAddressParams) => {
  const { session } = await getUserAuth();
  const { id: customerAddressId } = customerAddressIdSchema.parse({ id });
  const newCustomerAddress = updateCustomerAddressSchema.parse({ ...customerAddress, userId: session?.user.id! });
  try {
    const [c] =  await db
     .update(customerAddresses)
     .set({...newCustomerAddress, updatedAt: new Date() })
     .where(and(eq(customerAddresses.id, customerAddressId!), eq(customerAddresses.userId, session?.user.id!)))
     .returning();
    return { customerAddress: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCustomerAddress = async (id: CustomerAddressId) => {
  const { session } = await getUserAuth();
  const { id: customerAddressId } = customerAddressIdSchema.parse({ id });
  try {
    const [c] =  await db.delete(customerAddresses).where(and(eq(customerAddresses.id, customerAddressId!), eq(customerAddresses.userId, session?.user.id!)))
    .returning();
    return { customerAddress: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

