'use client';

import {
  CartItem,
  clearCart,
  decrementCartItem,
  incrementCartItem,
  removeFromCart,
} from '@/lib/api/cart/mutations';
import { useCart } from '../CartProvider';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Minus, Plus } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useRouter } from 'next/navigation';

export default function CartForm() {
  const { cart, setCart } = useCart()();
  const router = useRouter();

  return (
    <div className="space-y-8">
      <ScrollArea className="h-[400px] border-y py-4">
        <ul className="divide-y">
          {cart.items.map((cartItem) => (
            <CartItemComponent key={cartItem.variant.id} cartItem={cartItem} />
          ))}
        </ul>
      </ScrollArea>
      <div className="flex flex-col items-center justify-between">
        <Button
          onClick={() => router.push('/checkout')}
          className="w-full"
          variant={'default'}
        >
          Checkout
        </Button>
        <Button
          onClick={async () => setCart(await clearCart('cart'))}
          variant={'link'}
        >
          Empty cart
        </Button>
      </div>
    </div>
  );
}

const CartItemComponent = ({ cartItem: cartItem }: { cartItem: CartItem }) => {
  const { cart, setCart } = useCart()();

  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  return (
    <li className="w-full py-2">
      <div className="flex gap-4 w-full">
        <div>
          <Image
            src={cartItem.variant.image.url}
            alt={cartItem.variant.name}
            height={120}
            width={120}
            className="w-full object-cover"
          />
        </div>
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center text-sm w-full">
            <h3>{cartItem.variant.name}</h3>
            <p>
              {formatter.format(
                (cartItem.variant.price ?? 0) * cartItem.quantity,
              )}
            </p>
          </div>
          <div className="text-xs flex items-center flex-wrap gap-2">
            {cartItem.variant.options.map((option) => (
              <Badge key={option.id} variant={'outline'}>
                {option.value.name}
              </Badge>
            ))}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Button
                onClick={async () =>
                  setCart(await decrementCartItem({ cartId: 'cart', cartItem }))
                }
                size={'icon'}
                variant={'outline'}
                disabled={cartItem.quantity === 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                className="w-24 text-center text-sm"
                type="number"
                value={cartItem.quantity}
              />
              <Button
                onClick={async () =>
                  setCart(await incrementCartItem({ cartId: 'cart', cartItem }))
                }
                size={'icon'}
                variant={'outline'}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={async () =>
              setCart(await removeFromCart({ cartId: 'cart', cartItem }))
            }
            size={'sm'}
            variant={'link'}
            className="text-xs py-2"
          >
            Remove item
          </Button>
        </div>
      </div>
    </li>
  );
};
