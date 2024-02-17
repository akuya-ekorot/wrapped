'use client';

import { useCart } from '@/components/CartProvider';
import CartForm from '@/components/cart/CartForm';
import Modal from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function CartLink() {
  const cart = useCart()((state) => state.cart);
  const [open, setOpen] = useState(false);

  return (
    <div className="h-12 w-12 flex items-center justify-center">
      <Modal title="Cart" open={open} setOpen={setOpen}>
        <CartForm />
      </Modal>
      <Button
        onClick={() => setOpen((prev) => !prev)}
        variant={'link'}
        className="flex items-center gap-1 font-semibold text-xs"
      >
        <ShoppingCart />
        <span>{cart.items.length}</span>
      </Button>
    </div>
  );
}
