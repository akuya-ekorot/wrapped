'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/option-values/useOptimisticOptionValues';
import { type OptionValue } from '@/lib/db/schema/optionValues';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import OptionValueForm from '@/components/optionValues/OptionValueForm';
import { type Option, type OptionId } from '@/lib/db/schema/options';

export default function OptimisticOptionValue({
  optionValue,
  options,
  optionId,
}: {
  optionValue: OptionValue;

  options: Option[];
  optionId?: OptionId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: OptionValue) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticOptionValue, setOptimisticOptionValue] =
    useOptimistic(optionValue);
  const updateOptionValue: TAddOptimistic = (input) =>
    setOptimisticOptionValue({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <OptionValueForm
          optionValue={optionValue}
          options={options}
          optionId={optionId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateOptionValue}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optionValue.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticOptionValue.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticOptionValue, null, 2)}
      </pre>
    </div>
  );
}
