'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/options/useOptimisticOptions';
import { type Option } from '@/lib/db/schema/options';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import OptionForm from '@/components/options/OptionForm';
import { type Product, type ProductId } from '@/lib/db/schema/products';

export default function OptimisticOption({
  option,
  products,
  productId,
}: {
  option: Option;

  products: Product[];
  productId?: ProductId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Option) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticOption, setOptimisticOption] = useOptimistic(option);
  const updateOption: TAddOptimistic = (input) =>
    setOptimisticOption({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <OptionForm
          option={option}
          products={products}
          productId={productId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateOption}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{option.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticOption.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticOption, null, 2)}
      </pre>
    </div>
  );
}
