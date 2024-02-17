'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type ProductCollection,
  CompleteProductCollection,
} from '@/lib/db/schema/productCollections';
import Modal from '@/components/shared/Modal';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import { useOptimisticProductCollections } from '@/app/(app)/admin/product-collections/useOptimisticProductCollections';
import { Button } from '@/components/ui/button';
import ProductCollectionForm from './ProductCollectionForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (productCollection?: ProductCollection) => void;

export default function ProductCollectionList({
  productCollections,
  collections,
  collectionId,
  products,
  productId,
}: {
  productCollections: CompleteProductCollection[];
  collections: Collection[];
  collectionId?: CollectionId;
  products: Product[];
  productId?: ProductId;
}) {
  const { optimisticProductCollections, addOptimisticProductCollection } =
    useOptimisticProductCollections(productCollections, collections, products);
  const [open, setOpen] = useState(false);
  const [activeProductCollection, setActiveProductCollection] =
    useState<ProductCollection | null>(null);
  const openModal = (productCollection?: ProductCollection) => {
    setOpen(true);
    productCollection
      ? setActiveProductCollection(productCollection)
      : setActiveProductCollection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeProductCollection
            ? 'Edit ProductCollection'
            : 'Create Product Collection'
        }
      >
        <ProductCollectionForm
          productCollection={activeProductCollection}
          addOptimistic={addOptimisticProductCollection}
          openModal={openModal}
          closeModal={closeModal}
          collections={collections}
          collectionId={collectionId}
          products={products}
          productId={productId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticProductCollections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticProductCollections.map((productCollection) => (
            <ProductCollection
              productCollection={productCollection}
              key={productCollection.id}
              openModal={openModal}
              productId={productId}
              collectionId={collectionId}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const ProductCollection = ({
  productCollection,
  openModal,
  productId,
  collectionId,
}: {
  productCollection: CompleteProductCollection;
  openModal: TOpenModal;
  productId?: ProductId;
  collectionId?: CollectionId;
}) => {
  const optimistic = productCollection.id === 'optimistic';
  const deleting = productCollection.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('product-collections')
    ? pathname
    : productId
      ? pathname + '/collections/'
      : collectionId
        ? pathname + '/products/'
        : '/product-collections/';

  console.log({ basePath });
  console.log({
    finalPath:
      basePath +
      (productId
        ? productCollection.collectionId
        : collectionId
          ? productCollection.productId
          : productCollection.id),
  });

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>
          {productId
            ? productCollection.collection?.name
            : collectionId
              ? productCollection.product?.name
              : productCollection.collectionId}
        </div>
      </div>
      <Button variant={'link'} asChild>
        <Link
          href={
            basePath +
            '/' +
            (productId
              ? productCollection.collectionId
              : collectionId
                ? productCollection.productId
                : productCollection.id)
          }
        >
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No product collections
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new product collection.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Product Collections{' '}
        </Button>
      </div>
    </div>
  );
};
