'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/variants/useOptimisticVariants';
import { type Variant } from '@/lib/db/schema/variants';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import VariantForm from '@/components/variants/VariantForm';
import { type Product, type ProductId } from '@/lib/db/schema/products';

export default function OptimisticVariant({
  variant,
  products,
  productId,
}: {
  variant: Variant;

  products: Product[];
  productId?: ProductId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Variant) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticVariant, setOptimisticVariant] = useOptimistic(variant);
  const updateVariant: TAddOptimistic = (input) =>
    setOptimisticVariant({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <VariantForm
          variant={variant}
          products={products}
          productId={productId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateVariant}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{variant.productId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticVariant.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticVariant, null, 2)}
      </pre>
    </div>
  );
}
