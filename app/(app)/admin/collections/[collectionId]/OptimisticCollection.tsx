'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/collections/useOptimisticCollections';
import { type Collection } from '@/lib/db/schema/collections';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import CollectionForm from '@/components/collections/CollectionForm';
import CollectionInfoList from '@/components/collections/CollectionInfoList';

export default function OptimisticCollection({
  collection,
}: {
  collection: Collection;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Collection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCollection, setOptimisticCollection] =
    useOptimistic(collection);
  const updateCollection: TAddOptimistic = (input) =>
    setOptimisticCollection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CollectionForm
          collection={collection}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateCollection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{collection.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <CollectionInfoList collection={optimisticCollection} />
    </div>
  );
}
