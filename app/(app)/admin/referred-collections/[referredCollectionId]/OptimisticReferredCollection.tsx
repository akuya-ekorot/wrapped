'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/referred-collections/useOptimisticReferredCollections';
import { type ReferredCollection } from '@/lib/db/schema/referredCollections';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import ReferredCollectionForm from '@/components/referredCollections/ReferredCollectionForm';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import {
  type MainCollection,
  type MainCollectionId,
} from '@/lib/db/schema/mainCollections';

export default function OptimisticReferredCollection({
  referredCollection,
  collections,
  collectionId,
  mainCollections,
  mainCollectionId,
}: {
  referredCollection: ReferredCollection;

  collections: Collection[];
  collectionId?: CollectionId;
  mainCollections: MainCollection[];
  mainCollectionId?: MainCollectionId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: ReferredCollection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticReferredCollection, setOptimisticReferredCollection] =
    useOptimistic(referredCollection);
  const updateReferredCollection: TAddOptimistic = (input) =>
    setOptimisticReferredCollection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ReferredCollectionForm
          referredCollection={referredCollection}
          collections={collections}
          collectionId={collectionId}
          mainCollections={mainCollections}
          mainCollectionId={mainCollectionId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateReferredCollection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {referredCollection.collectionId}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticReferredCollection.id === 'optimistic'
            ? 'animate-pulse'
            : '',
        )}
      >
        {JSON.stringify(optimisticReferredCollection, null, 2)}
      </pre>
    </div>
  );
}
