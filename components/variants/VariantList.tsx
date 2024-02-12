'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { type Variant, CompleteVariant } from '@/lib/db/schema/variants';
import Modal from '@/components/shared/Modal';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import { useOptimisticVariants } from '@/app/(app)/admin/variants/useOptimisticVariants';
import { Button } from '@/components/ui/button';
import VariantForm from './VariantForm';
import { PlusIcon } from 'lucide-react';
import { DataTable } from '../shared/data-table';
import { columns } from './columns';

type TOpenModal = (variant?: Variant) => void;

export default function VariantList({
  variants,
  products,
  productId,
}: {
  variants: CompleteVariant[];
  products: Product[];
  productId?: ProductId;
}) {
  const { optimisticVariants, addOptimisticVariant } = useOptimisticVariants(
    variants,
    products,
  );
  const [open, setOpen] = useState(false);
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);
  const openModal = (variant?: Variant) => {
    setOpen(true);
    variant ? setActiveVariant(variant) : setActiveVariant(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeVariant ? 'Edit Variant' : 'Create Variant'}
      >
        <VariantForm
          variant={activeVariant}
          addOptimistic={addOptimisticVariant}
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
      {optimisticVariants.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable
          resourceName="variants"
          columns={columns}
          data={optimisticVariants}
        />
      )}
    </div>
  );
}

const Variant = ({
  variant,
  openModal,
}: {
  variant: CompleteVariant;
  openModal: TOpenModal;
}) => {
  const optimistic = variant.id === 'optimistic';
  const deleting = variant.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('variants')
    ? pathname
    : pathname + '/variants/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{variant.name}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + variant.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No variants
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new variant.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Variants{' '}
        </Button>
      </div>
    </div>
  );
};
