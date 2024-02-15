'use client';

import { useCart } from '@/components/CartProvider';
import { ShoppingCart } from 'lucide-react';

export default function CartLink() {
  const cart = useCart()((state) => state.cart);

  return (
    <div className="flex items-center gap-1 font-semibold text-xs">
      <ShoppingCart />
      <span>{cart.length}</span>
    </div>
  );
}
