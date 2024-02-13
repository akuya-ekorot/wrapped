'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type HeroCollection,
  CompleteHeroCollection,
} from '@/lib/db/schema/heroCollections';
import Modal from '@/components/shared/Modal';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { type HeroLink, type HeroLinkId } from '@/lib/db/schema/heroLinks';
import { useOptimisticHeroCollections } from '@/app/(app)/admin/hero-collections/useOptimisticHeroCollections';
import { Button } from '@/components/ui/button';
import HeroCollectionForm from './HeroCollectionForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (heroCollection?: HeroCollection) => void;

export default function HeroCollectionList({
  heroCollections,
  collections,
  collectionId,
  heroLinks,
  heroLinkId,
}: {
  heroCollections: CompleteHeroCollection[];
  collections: Collection[];
  collectionId?: CollectionId;
  heroLinks: HeroLink[];
  heroLinkId?: HeroLinkId;
}) {
  const { optimisticHeroCollections, addOptimisticHeroCollection } =
    useOptimisticHeroCollections(heroCollections, collections, heroLinks);
  const [open, setOpen] = useState(false);
  const [activeHeroCollection, setActiveHeroCollection] =
    useState<HeroCollection | null>(null);
  const openModal = (heroCollection?: HeroCollection) => {
    setOpen(true);
    heroCollection
      ? setActiveHeroCollection(heroCollection)
      : setActiveHeroCollection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeHeroCollection
            ? 'Edit HeroCollection'
            : 'Create Hero Collection'
        }
      >
        <HeroCollectionForm
          heroCollection={activeHeroCollection}
          addOptimistic={addOptimisticHeroCollection}
          openModal={openModal}
          closeModal={closeModal}
          collections={collections}
          collectionId={collectionId}
          heroLinks={heroLinks}
          heroLinkId={heroLinkId}
        />
      </Modal>
      {optimisticHeroCollections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticHeroCollections.map((heroCollection) => (
            <HeroCollection
              heroCollection={heroCollection}
              key={heroCollection.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const HeroCollection = ({
  heroCollection,
  openModal,
}: {
  heroCollection: CompleteHeroCollection;
  openModal: TOpenModal;
}) => {
  const optimistic = heroCollection.id === 'optimistic';
  const deleting = heroCollection.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('hero-collections')
    ? pathname
    : pathname + '/hero-collections/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{heroCollection.collection?.name}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + heroCollection.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No hero collection
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new hero collection.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Hero Collection{' '}
        </Button>
      </div>
    </div>
  );
};
