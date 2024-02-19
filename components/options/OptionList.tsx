'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { type Option, CompleteOption } from '@/lib/db/schema/options';
import Modal from '@/components/shared/Modal';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import { useOptimisticOptions } from '@/app/(app)/admin/options/useOptimisticOptions';
import { Button } from '@/components/ui/button';
import OptionForm from './OptionForm';
import { PlusIcon } from 'lucide-react';
import { DataTable } from '../shared/data-table';
import { columns } from './columns';

type TOpenModal = (option?: Option) => void;

export default function OptionList({
  options,
  products,
  productId,
}: {
  options: CompleteOption[];
  products: Product[];
  productId?: ProductId;
}) {
  const { optimisticOptions, addOptimisticOption } = useOptimisticOptions(
    options,
    products,
  );
  const [open, setOpen] = useState(false);
  const [activeOption, setActiveOption] = useState<Option | null>(null);
  const openModal = (option?: Option) => {
    setOpen(true);
    option ? setActiveOption(option) : setActiveOption(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeOption ? 'Edit Option' : 'Create Option'}
      >
        <OptionForm
          option={activeOption}
          addOptimistic={addOptimisticOption}
          openModal={openModal}
          closeModal={closeModal}
          products={products}
          productId={productId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticOptions.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable
          searchColumn="name"
          resourceName="options"
          columns={columns}
          data={optimisticOptions}
        />
      )}
    </div>
  );
}

const Option = ({
  option,
  openModal,
}: {
  option: CompleteOption;
  openModal: TOpenModal;
}) => {
  const optimistic = option.id === 'optimistic';
  const deleting = option.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('options')
    ? pathname
    : pathname + '/options/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{option.name}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + option.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No options
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new option.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Options{' '}
        </Button>
      </div>
    </div>
  );
};
