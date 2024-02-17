'use client';

import { Customer } from '@/lib/db/schema/customers';
import { useState, createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';

const createStore = (customer: Customer | null) =>
  create<{
    customer: Customer | null;
    setCustomer: (customer: Customer | null) => void;
  }>((set) => ({
    customer: customer,
    setCustomer(customer: Customer | null) {
      set({ customer });
    },
  }));

const CustomerContext = createContext<ReturnType<typeof createStore> | null>(
  null,
);

export const useCustomer = () => {
  if (!CustomerContext)
    throw new Error('useCustomer must be used within a CustomerProvider');
  return useContext(CustomerContext)!;
};

const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [store, setStore] = useState(() => createStore(customer));

  useEffect(() => {
    const getCustomer = (customerKey: string) => {
      if (localStorage === undefined) {
        return {} as Customer;
      }

      const customer = localStorage.getItem(customerKey);
      return customer ? (JSON.parse(customer) as Customer) : ({} as Customer);
    };

    const customer = getCustomer('customer');
    setCustomer(customer);
    setStore(() => createStore(customer));
  }, [setCustomer, setStore]);

  return (
    <CustomerContext.Provider value={store}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;
