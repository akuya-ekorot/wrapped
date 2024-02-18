import { CompleteProductPage } from '@/lib/api/products/queries';

export const hasProductOptions = (options: CompleteProductPage['options']) => {
  if (options.length === 0) return false;
  return true;
};
