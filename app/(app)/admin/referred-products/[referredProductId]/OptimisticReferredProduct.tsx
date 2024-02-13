'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/referred-products/useOptimisticReferredProducts';
import { type ReferredProduct } from '@/lib/db/schema/referredProducts';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import ReferredProductForm from '@/components/referredProducts/ReferredProductForm';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import {
  type FeaturedProductsSection,
  type FeaturedProductsSectionId,
} from '@/lib/db/schema/featuredProductsSection';

export default function OptimisticReferredProduct({
  referredProduct,
  products,
  productId,
  featuredProductsSection,
  featuredProductsSectionId,
}: {
  referredProduct: ReferredProduct;

  products: Product[];
  productId?: ProductId;
  featuredProductsSection: FeaturedProductsSection[];
  featuredProductsSectionId?: FeaturedProductsSectionId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: ReferredProduct) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticReferredProduct, setOptimisticReferredProduct] =
    useOptimistic(referredProduct);
  const updateReferredProduct: TAddOptimistic = (input) =>
    setOptimisticReferredProduct({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ReferredProductForm
          referredProduct={referredProduct}
          products={products}
          productId={productId}
          featuredProductsSection={featuredProductsSection}
          featuredProductsSectionId={featuredProductsSectionId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateReferredProduct}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{referredProduct.productId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticReferredProduct.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticReferredProduct, null, 2)}
      </pre>
    </div>
  );
}
