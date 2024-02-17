'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { type Product, CompleteProduct } from '@/lib/db/schema/products';
import Modal from '@/components/shared/Modal';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { useOptimisticProducts } from '@/app/(app)/admin/products/useOptimisticProducts';
import { Button } from '@/components/ui/button';
import ProductForm from './ProductForm';
import { PlusIcon } from 'lucide-react';
import { DataTable } from '../shared/data-table';
import { columns } from './columns';

type TOpenModal = (product?: Product) => void;

export default function ProductList({
  products,
  collections,
}: {
  products: CompleteProduct[];
  collections: Collection[];
}) {
  const { optimisticProducts, addOptimisticProduct } = useOptimisticProducts(
    products,
    collections,
  );
  const [open, setOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const openModal = (product?: Product) => {
    setOpen(true);
    product ? setActiveProduct(product) : setActiveProduct(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeProduct ? 'Edit Product' : 'Create Product'}
      >
        <ProductForm
          product={activeProduct}
          addOptimistic={addOptimisticProduct}
          openModal={openModal}
          closeModal={closeModal}
          collections={collections}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticProducts.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable
          resourceName="products"
          data={optimisticProducts}
          columns={columns}
        />
      )}
    </div>
  );
}

const Product = ({
  product,
  openModal,
}: {
  product: CompleteProduct;
  openModal: TOpenModal;
}) => {
  const optimistic = product.id === 'optimistic';
  const deleting = product.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('products')
    ? pathname
    : pathname + '/products/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{product.name}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + product.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No products
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new product.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Products{' '}
        </Button>
      </div>
    </div>
  );
};
