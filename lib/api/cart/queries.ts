import { Cart } from './mutations';

export const getCart = (cartId: string) => {
  if (localStorage === undefined) {
    return { items: [], totalPrice: 0 };
  }

  const cart = localStorage.getItem(cartId);
  return cart ? (JSON.parse(cart) as Cart) : { items: [], totalPrice: 0 };
};
