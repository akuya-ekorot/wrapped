import { Variant } from '@/lib/db/schema/variants';
import { getCart } from './queries';
import { OptionValue } from '@/lib/db/schema/optionValues';
import { Option } from '@/lib/db/schema/options';
import { TImage } from '@/lib/db/schema/images';

export type CartItem = {
  variant: {
    image: TImage;
    options: ({
      value: OptionValue;
    } & Option)[];
  } & Variant;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  totalPrice: number;
};

const setCart = async (cartId: string, cart: Cart) => {
  localStorage.setItem(cartId, JSON.stringify(cart));
};

export const addToCart = async ({
  cartId,
  cartItem,
}: {
  cartId: string;
  cartItem: CartItem;
}) => {
  let cart = getCart(cartId);

  if (cart) {
    const existingItem = cart.items.find(
      (item) => item.variant.id === cartItem.variant.id,
    );

    if (existingItem) {
      existingItem.quantity += cartItem.quantity;
      cart.totalPrice += (cartItem.variant.price ?? 0) * cartItem.quantity;
    } else {
      cart.items.push(cartItem);
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + (item.variant.price ?? 0) * item.quantity,
        0,
      );
    }
  } else {
    cart = { items: [cartItem], totalPrice: cartItem.variant.price ?? 0 };
  }

  await setCart(cartId, cart);
  return cart;
};

export const removeFromCart = async ({
  cartId,
  cartItem,
}: {
  cartId: string;
  cartItem: CartItem;
}) => {
  let cart = getCart(cartId);

  if (cart) {
    cart = {
      totalPrice:
        cart.totalPrice - (cartItem.variant.price ?? 0) * cartItem.quantity,
      items: cart.items.filter(
        (item) => item.variant.id !== cartItem.variant.id,
      ),
    };
  }

  await setCart(cartId, cart);
  return cart;
};

export const incrementCartItem = async ({
  cartId,
  cartItem,
}: {
  cartId: string;
  cartItem: CartItem;
}) => {
  let cart = getCart(cartId);

  if (cart) {
    cart = {
      totalPrice: cart.totalPrice + (cartItem.variant.price ?? 0),
      items: cart.items.map((item) =>
        item.variant.id === cartItem.variant.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    };
  }

  await setCart(cartId, cart);
  return cart;
};

export const decrementCartItem = async ({
  cartId,
  cartItem,
}: {
  cartId: string;
  cartItem: CartItem;
}) => {
  let cart = getCart(cartId);

  if (cart) {
    cart = {
      totalPrice: cart.totalPrice - (cartItem.variant.price ?? 0),
      items: cart.items.map((item) =>
        item.variant.id === cartItem.variant.id
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    };
  }

  await setCart(cartId, cart);
  return cart;
};

export const clearCart = async (cartId: string) => {
  localStorage.removeItem(cartId);
  return { items: [], totalPrice: 0 };
};
