'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/main-collections/useOptimisticMainCollections';
import { type MainCollection } from '@/lib/db/schema/mainCollections';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import MainCollectionForm from '@/components/mainCollections/MainCollectionForm';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';
import InfoListItem from '@/components/shared/InfoListItem';

export default function OptimisticMainCollection({
  mainCollection,
  homePages,
  homePageId,
}: {
  mainCollection: MainCollection;

  homePages: HomePage[];
  homePageId?: HomePageId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: MainCollection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticMainCollection, setOptimisticMainCollection] =
    useOptimistic(mainCollection);
  const updateMainCollection: TAddOptimistic = (input) =>
    setOptimisticMainCollection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <MainCollectionForm
          mainCollection={mainCollection}
          homePages={homePages}
          homePageId={homePageId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateMainCollection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{mainCollection.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
    </div>
  );
}
