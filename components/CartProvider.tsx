'use client';

import { getProductPageDetailsByProductId } from '@/lib/api/products/queries';
import { useState, createContext, useContext } from 'react';
import { create } from 'zustand';

type Variant = NonNullable<
  Awaited<ReturnType<typeof getProductPageDetailsByProductId>>
>['variants'][number];

type Cart = {
  variant: Variant;
  quantity: number;
}[];
type CartStore = {
  cart: Cart;
  setCart: (newCart: { variant: Variant; quantity: number }[]) => void;
};

const createStore = (cart: Cart) =>
  create<CartStore>((set) => ({
    cart,
    setCart: (newCart: Cart) => set({ cart: newCart }),
  }));

const CartContext = createContext<ReturnType<typeof createStore> | null>(null);

export const useCart = () => {
  if (!CartContext) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return useContext(CartContext)!;
};

const CartProvider = ({
  cart,
  children,
}: {
  cart: Cart;
  children: React.ReactNode;
}) => {
  const [store] = useState(() => createStore(cart));
  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};

export default CartProvider;
