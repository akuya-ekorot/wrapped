'use client';
import { Cart } from '@/lib/api/cart/mutations';
import { getCart } from '@/lib/api/cart/queries';
import { useState, createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';

const createStore = (cart: Cart) =>
  create<{
    cart: Cart;
    setCart: (cart: Cart) => void;
  }>((set) => ({
    cart,
    setCart(cart: Cart) {
      set({ cart });
    },
  }));

const CartContext = createContext<ReturnType<typeof createStore> | null>(null);

export const useCart = () => {
  if (!CartContext)
    throw new Error('useCart must be used within a CartProvider');
  return useContext(CartContext)!;
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() => createStore(getCart('cart')));
  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};

export default CartProvider;
