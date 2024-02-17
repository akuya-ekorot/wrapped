'use client';

import { DeliveryZone } from '@/lib/db/schema/deliveryZones';
import { useState, createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';

const createStore = (deliveryZone: DeliveryZone | null) =>
  create<{
    deliveryZone: DeliveryZone | null;
    setDeliveryZone: (deliveryZone: DeliveryZone | null) => void;
  }>((set) => ({
    deliveryZone,
    setDeliveryZone(deliveryZone: DeliveryZone | null) {
      set({ deliveryZone });
    },
  }));

const DeliveryZoneContext = createContext<ReturnType<
  typeof createStore
> | null>(null);

export const useDeliveryZone = () => {
  if (!DeliveryZoneContext)
    throw new Error(
      'useDeliveryZone must be used within a DeliveryZoneProvider',
    );
  return useContext(DeliveryZoneContext)!;
};

const DeliveryZoneProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() => createStore(null));

  return (
    <DeliveryZoneContext.Provider value={store}>
      {children}
    </DeliveryZoneContext.Provider>
  );
};

export default DeliveryZoneProvider;
