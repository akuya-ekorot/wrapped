'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';

type CheckoutStep = number;

const createStore = (checkoutStep: CheckoutStep) =>
  create<{
    checkoutStep: CheckoutStep;
    setCheckoutStep: (checkoutStep: CheckoutStep) => void;
  }>((set) => ({
    checkoutStep,
    setCheckoutStep(checkoutStep: CheckoutStep) {
      set({ checkoutStep });
    },
  }));

const CheckoutStepContext = createContext<ReturnType<
  typeof createStore
> | null>(null);

export const useCheckoutStep = () => {
  if (!CheckoutStepContext)
    throw new Error(
      'useCheckoutStep must be used within a CheckoutStepProvider',
    );
  return useContext(CheckoutStepContext)!;
};

const CheckoutStepProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() => createStore(0));

  return (
    <CheckoutStepContext.Provider value={store}>
      {children}
    </CheckoutStepContext.Provider>
  );
};

export default CheckoutStepProvider;
