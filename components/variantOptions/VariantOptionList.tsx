'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type VariantOption,
  CompleteVariantOption,
} from '@/lib/db/schema/variantOptions';
import Modal from '@/components/shared/Modal';
import { type Option, type OptionId } from '@/lib/db/schema/options';
import {
  type OptionValue,
  type OptionValueId,
} from '@/lib/db/schema/optionValues';
import { type Variant, type VariantId } from '@/lib/db/schema/variants';
import { useOptimisticVariantOptions } from '@/app/(app)/admin/variant-options/useOptimisticVariantOptions';
import { Button } from '@/components/ui/button';
import VariantOptionForm from './VariantOptionForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (variantOption?: VariantOption) => void;

export default function VariantOptionList({
  variantOptions,
  options,
  optionId,
  optionValues,
  optionValueId,
  variants,
  variantId,
}: {
  variantOptions: CompleteVariantOption[];
  options: Option[];
  optionId?: OptionId;
  optionValues: OptionValue[];
  optionValueId?: OptionValueId;
  variants: Variant[];
  variantId?: VariantId;
}) {
  const { optimisticVariantOptions, addOptimisticVariantOption } =
    useOptimisticVariantOptions(
      variantOptions,
      options,
      optionValues,
      variants,
    );
  const [open, setOpen] = useState(false);
  const [activeVariantOption, setActiveVariantOption] =
    useState<VariantOption | null>(null);
  const openModal = (variantOption?: VariantOption) => {
    setOpen(true);
    variantOption
      ? setActiveVariantOption(variantOption)
      : setActiveVariantOption(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeVariantOption ? 'Edit VariantOption' : 'Create Variant Option'
        }
      >
        <VariantOptionForm
          variantOption={activeVariantOption}
          addOptimistic={addOptimisticVariantOption}
          openModal={openModal}
          closeModal={closeModal}
          options={options}
          optionId={optionId}
          optionValues={optionValues}
          optionValueId={optionValueId}
          variants={variants}
          variantId={variantId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticVariantOptions.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticVariantOptions.map((variantOption) => (
            <VariantOption
              variantOption={variantOption}
              key={variantOption.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const VariantOption = ({
  variantOption,
  openModal,
}: {
  variantOption: CompleteVariantOption;
  openModal: TOpenModal;
}) => {
  const optimistic = variantOption.id === 'optimistic';
  const deleting = variantOption.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('variant-options')
    ? pathname
    : pathname + '/variant-options/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{variantOption.optionId}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + variantOption.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No variant options
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new variant option.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Variant Options{' '}
        </Button>
      </div>
    </div>
  );
};
