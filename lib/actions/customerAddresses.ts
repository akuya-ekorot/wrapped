"use server";

import { revalidatePath } from "next/cache";
import {
  createCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@/lib/api/customerAddresses/mutations";
import {
  CustomerAddressId,
  NewCustomerAddressParams,
  UpdateCustomerAddressParams,
  customerAddressIdSchema,
  insertCustomerAddressParams,
  updateCustomerAddressParams,
} from "@/lib/db/schema/customerAddresses";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateCustomerAddresses = () => revalidatePath("/customer-addresses");

export const createCustomerAddressAction = async (input: NewCustomerAddressParams) => {
  try {
    const payload = insertCustomerAddressParams.parse(input);
    await createCustomerAddress(payload);
    revalidateCustomerAddresses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCustomerAddressAction = async (input: UpdateCustomerAddressParams) => {
  try {
    const payload = updateCustomerAddressParams.parse(input);
    await updateCustomerAddress(payload.id, payload);
    revalidateCustomerAddresses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCustomerAddressAction = async (input: CustomerAddressId) => {
  try {
    const payload = customerAddressIdSchema.parse({ id: input });
    await deleteCustomerAddress(payload.id);
    revalidateCustomerAddresses();
  } catch (e) {
    return handleErrors(e);
  }
};