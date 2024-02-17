'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/variant-options/useOptimisticVariantOptions';
import { type VariantOption } from '@/lib/db/schema/variantOptions';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import VariantOptionForm from '@/components/variantOptions/VariantOptionForm';
import { type Option, type OptionId } from '@/lib/db/schema/options';
import {
  type OptionValue,
  type OptionValueId,
} from '@/lib/db/schema/optionValues';
import { type Variant, type VariantId } from '@/lib/db/schema/variants';
import { ProductId } from '@/lib/db/schema/products';

export default function OptimisticVariantOption({
  variantOption,
  options,
  optionId,
  optionValues,
  optionValueId,
  variants,
  variantId,
  productId,
}: {
  variantOption: VariantOption;
  options: Option[];
  optionId?: OptionId;
  optionValues: OptionValue[];
  optionValueId?: OptionValueId;
  variants: Variant[];
  variantId?: VariantId;
  productId: ProductId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: VariantOption) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticVariantOption, setOptimisticVariantOption] =
    useOptimistic(variantOption);
  const updateVariantOption: TAddOptimistic = (input) =>
    setOptimisticVariantOption({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <VariantOptionForm
          productId={productId}
          variantOption={variantOption}
          options={options}
          optionId={optionId}
          optionValues={optionValues}
          optionValueId={optionValueId}
          variants={variants}
          variantId={variantId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateVariantOption}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{variantOption.optionId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticVariantOption.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticVariantOption, null, 2)}
      </pre>
    </div>
  );
}
