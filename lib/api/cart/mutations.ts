import { Variant } from '@/lib/db/schema/variants';
import { getCart } from './queries';
import { OptionValue } from '@/lib/db/schema/optionValues';
import { Option } from '@/lib/db/schema/options';
import { TImage } from '@/lib/db/schema/images';
import { Product } from '@/lib/db/schema/products';

export type CartItem = {
  product?: {
    image: TImage;
  } & Product;
  variant?: {
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
    const existingItem = cart.items.find((item) =>
      item.variant
        ? item.variant.id === cartItem.variant!.id
        : item.product!.id === cartItem.product!.id,
    );

    if (existingItem) {
      existingItem.quantity += cartItem.quantity;
      cart.totalPrice +=
        (cartItem.variant
          ? cartItem.variant.price ?? 0
          : cartItem.product!.price) * cartItem.quantity;
    } else {
      cart.items.push(cartItem);
      cart.totalPrice = cart.items.reduce(
        (acc, item) =>
          acc +
          (item.variant ? item.variant.price ?? 0 : item.product!.price ?? 0) *
            item.quantity,
        0,
      );
    }
  } else {
    cart = {
      items: [cartItem],
      totalPrice: cartItem.variant
        ? cartItem.variant.price ?? 0
        : cartItem.product!.price ?? 0,
    };
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
        cart.totalPrice -
        (cartItem.variant
          ? cartItem.variant.price ?? 0
          : cartItem.product!.price ?? 0) *
          cartItem.quantity,
      items: cart.items.filter((item) =>
        item.variant
          ? item.variant.id !== cartItem.variant!.id
          : item.product!.id !== cartItem.product!.id,
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
      totalPrice:
        cart.totalPrice +
        (cartItem.variant
          ? cartItem.variant.price ?? 0
          : cartItem.product!.price ?? 0),
      items: cart.items.map((item) =>
        (
          item.variant
            ? item.variant.id === cartItem.variant!.id
            : item.product!.id === cartItem.product!.id
        )
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
      totalPrice:
        cart.totalPrice -
        (cartItem.variant
          ? cartItem.variant.price ?? 0
          : cartItem.product!.price ?? 0),
      items: cart.items.map((item) =>
        (
          item.variant
            ? item.variant.id === cartItem.variant!.id
            : item.product!.id === cartItem.product!.id
        )
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
