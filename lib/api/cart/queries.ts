import { Cart } from './mutations';

export const getCart = (cartId: string) => {
  const cart = localStorage.getItem(cartId);

  return cart ? (JSON.parse(cart) as Cart) : { items: [] };
};
