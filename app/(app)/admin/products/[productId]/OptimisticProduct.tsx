'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/products/useOptimisticProducts';
import { type Product } from '@/lib/db/schema/products';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import ProductForm from '@/components/products/ProductForm';
import { type Collection } from '@/lib/db/schema/collections';
import InfoListItem from '@/components/shared/InfoListItem';

export default function OptimisticProduct({
  product,
  collections,
}: {
  product: Product;

  collections: Collection[];
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Product) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticProduct, setOptimisticProduct] = useOptimistic(product);
  const updateProduct: TAddOptimistic = (input) =>
    setOptimisticProduct({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ProductForm
          product={product}
          collections={collections}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateProduct}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{product.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(optimisticProduct)
          .filter(([key]) => !['id', 'createdAt', 'updatedAt'].includes(key))
          .map(([key, value]) =>
            key === 'collectionId' ? (
              <InfoListItem
                key={key}
                title={'collection'}
                value={collections.find((c) => c.id === value)?.name!}
              />
            ) : (
              <InfoListItem key={key} title={key} value={value} />
            ),
          )}
      </div>
    </div>
  );
}
