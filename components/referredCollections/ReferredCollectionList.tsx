'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type ReferredCollection,
  CompleteReferredCollection,
} from '@/lib/db/schema/referredCollections';
import Modal from '@/components/shared/Modal';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import {
  type MainCollection,
  type MainCollectionId,
} from '@/lib/db/schema/mainCollections';
import { useOptimisticReferredCollections } from '@/app/(app)/admin/referred-collections/useOptimisticReferredCollections';
import { Button } from '@/components/ui/button';
import ReferredCollectionForm from './ReferredCollectionForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (referredCollection?: ReferredCollection) => void;

export default function ReferredCollectionList({
  referredCollections,
  collections,
  collectionId,
  mainCollections,
  mainCollectionId,
}: {
  referredCollections: CompleteReferredCollection[];
  collections: Collection[];
  collectionId?: CollectionId;
  mainCollections: MainCollection[];
  mainCollectionId?: MainCollectionId;
}) {
  const { optimisticReferredCollections, addOptimisticReferredCollection } =
    useOptimisticReferredCollections(
      referredCollections,
      collections,
      mainCollections,
    );
  const [open, setOpen] = useState(false);
  const [activeReferredCollection, setActiveReferredCollection] =
    useState<ReferredCollection | null>(null);
  const openModal = (referredCollection?: ReferredCollection) => {
    setOpen(true);
    referredCollection
      ? setActiveReferredCollection(referredCollection)
      : setActiveReferredCollection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeReferredCollection
            ? 'Edit ReferredCollection'
            : 'Create Referred Collection'
        }
      >
        <ReferredCollectionForm
          referredCollection={activeReferredCollection}
          addOptimistic={addOptimisticReferredCollection}
          openModal={openModal}
          closeModal={closeModal}
          collections={collections}
          collectionId={collectionId}
          mainCollections={mainCollections}
          mainCollectionId={mainCollectionId}
        />
      </Modal>
      {optimisticReferredCollections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticReferredCollections.map((referredCollection) => (
            <ReferredCollection
              referredCollection={referredCollection}
              key={referredCollection.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const ReferredCollection = ({
  referredCollection,
  openModal,
}: {
  referredCollection: CompleteReferredCollection;
  openModal: TOpenModal;
}) => {
  const optimistic = referredCollection.id === 'optimistic';
  const deleting = referredCollection.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('referred-collections')
    ? pathname
    : pathname + '/referred-collections/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{referredCollection.collection?.name}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + referredCollection.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No referred collection
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new referred collection.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Referred Collection{' '}
        </Button>
      </div>
    </div>
  );
};
