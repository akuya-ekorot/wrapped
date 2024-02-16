'use client';

import { Cart } from '@/lib/api/cart/mutations';
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
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [store, setStore] = useState(() => createStore(cart));

  useEffect(() => {
    const getCart = (cartId: string) => {
      if (localStorage === undefined) {
        return { items: [] };
      }

      const cart = localStorage.getItem(cartId);
      return cart ? (JSON.parse(cart) as Cart) : { items: [] };
    };
    const cart = getCart('cart');
    setCart(cart);
    setStore(() => createStore(cart));
  }, [setCart, setStore]);

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};

export default CartProvider;
