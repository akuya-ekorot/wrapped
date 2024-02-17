'use client';

import { useCart } from '@/components/CartProvider';
import CartForm from '@/components/cart/CartForm';
import Modal from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { type CartItem, addToCart } from '@/lib/api/cart/mutations';
import { useState } from 'react';

export default function AddToCartButton({
  cartItem,
}: {
  cartItem: CartItem | undefined;
}) {
  const setCart = useCart()((store) => store.setCart);
  const [open, setOpen] = useState(false);

  if (!cartItem) {
    return (
      <Button disabled className="w-full">
        Product with selected options unavailable
      </Button>
    );
  }

  return (
    <div>
      <Modal title="Cart" open={open} setOpen={setOpen}>
        <CartForm />
      </Modal>
      <Button
        onClick={async () => {
          setCart(await addToCart({ cartId: 'cart', cartItem }));
          setOpen(true);
        }}
        className="w-full"
      >
        Add to cart
      </Button>
    </div>
  );
}
