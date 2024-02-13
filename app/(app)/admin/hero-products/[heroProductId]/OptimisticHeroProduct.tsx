'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/hero-products/useOptimisticHeroProducts';
import { type HeroProduct } from '@/lib/db/schema/heroProducts';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import HeroProductForm from '@/components/heroProducts/HeroProductForm';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import { type HeroLink, type HeroLinkId } from '@/lib/db/schema/heroLinks';

export default function OptimisticHeroProduct({
  heroProduct,
  products,
  productId,
  heroLinks,
  heroLinkId,
}: {
  heroProduct: HeroProduct;

  products: Product[];
  productId?: ProductId;
  heroLinks: HeroLink[];
  heroLinkId?: HeroLinkId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: HeroProduct) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticHeroProduct, setOptimisticHeroProduct] =
    useOptimistic(heroProduct);
  const updateHeroProduct: TAddOptimistic = (input) =>
    setOptimisticHeroProduct({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <HeroProductForm
          heroProduct={heroProduct}
          products={products}
          productId={productId}
          heroLinks={heroLinks}
          heroLinkId={heroLinkId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateHeroProduct}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{heroProduct.productId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticHeroProduct.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticHeroProduct, null, 2)}
      </pre>
    </div>
  );
}
