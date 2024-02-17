'use client';

import { OrderType } from '@/lib/db/schema/orders';
import { useState, createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';

const createStore = (orderType: OrderType | null) =>
  create<{
    orderType: OrderType | null;
    setOrderType: (orderType: OrderType | null) => void;
  }>((set) => ({
    orderType,
    setOrderType(orderType: OrderType | null) {
      set({ orderType });
    },
  }));

const OrderTypeContext = createContext<ReturnType<typeof createStore> | null>(
  null,
);

export const useOrderType = () => {
  if (!OrderTypeContext)
    throw new Error('useOrderType must be used within a OrderTypeProvider');
  return useContext(OrderTypeContext)!;
};

const OrderTypeProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() => createStore(null));

  return (
    <OrderTypeContext.Provider value={store}>
      {children}
    </OrderTypeContext.Provider>
  );
};

export default OrderTypeProvider;
