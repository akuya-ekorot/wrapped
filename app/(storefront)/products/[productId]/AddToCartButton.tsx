'use client';

import { useCart } from '@/components/CartProvider';
import { Button } from '@/components/ui/button';
import { getProductPageDetailsByProductId } from '@/lib/api/products/queries';

export default function AddToCartButton({
  variant,
}: {
  variant:
    | NonNullable<
        Awaited<ReturnType<typeof getProductPageDetailsByProductId>>
      >['variants'][number]
    | undefined;
}) {
  const setCart = useCart()((store) => store.setCart);

  if (!variant) {
    return (
      <Button disabled className="w-full">
        Product with selected options unavailable
      </Button>
    );
  }

  return (
    <Button
      onClick={async () => {
        setCart([{ variant, quantity: 1 }]);
      }}
      disabled={!variant}
      className="w-full"
    >
      Add to cart
    </Button>
  );
}
