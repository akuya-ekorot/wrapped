'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/hero-collections/useOptimisticHeroCollections';
import { type HeroCollection } from '@/lib/db/schema/heroCollections';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import HeroCollectionForm from '@/components/heroCollections/HeroCollectionForm';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { type HeroLink, type HeroLinkId } from '@/lib/db/schema/heroLinks';

export default function OptimisticHeroCollection({
  heroCollection,
  collections,
  collectionId,
  heroLinks,
  heroLinkId,
}: {
  heroCollection: HeroCollection;

  collections: Collection[];
  collectionId?: CollectionId;
  heroLinks: HeroLink[];
  heroLinkId?: HeroLinkId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: HeroCollection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticHeroCollection, setOptimisticHeroCollection] =
    useOptimistic(heroCollection);
  const updateHeroCollection: TAddOptimistic = (input) =>
    setOptimisticHeroCollection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <HeroCollectionForm
          heroCollection={heroCollection}
          collections={collections}
          collectionId={collectionId}
          heroLinks={heroLinks}
          heroLinkId={heroLinkId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateHeroCollection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {heroCollection.collectionId}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticHeroCollection.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticHeroCollection, null, 2)}
      </pre>
    </div>
  );
}
