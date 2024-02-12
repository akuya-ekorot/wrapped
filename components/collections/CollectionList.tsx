'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type Collection,
  CompleteCollection,
} from '@/lib/db/schema/collections';
import Modal from '@/components/shared/Modal';

import { useOptimisticCollections } from '@/app/(app)/admin/collections/useOptimisticCollections';
import { Button } from '@/components/ui/button';
import CollectionForm from './CollectionForm';
import { PlusIcon } from 'lucide-react';
import { DataTable } from '../shared/data-table';
import { columns } from './columns';

type TOpenModal = (collection?: Collection) => void;

export default function CollectionList({
  collections,
}: {
  collections: CompleteCollection[];
}) {
  const { optimisticCollections, addOptimisticCollection } =
    useOptimisticCollections(collections);
  const [open, setOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(
    null,
  );
  const openModal = (collection?: Collection) => {
    setOpen(true);
    collection ? setActiveCollection(collection) : setActiveCollection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeCollection ? 'Edit Collection' : 'Create Collection'}
      >
        <CollectionForm
          collection={activeCollection}
          addOptimistic={addOptimisticCollection}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticCollections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable
          resourceName="collections"
          columns={columns}
          data={optimisticCollections}
        />
      )}
    </div>
  );
}

const Collection = ({
  collection,
  openModal,
}: {
  collection: CompleteCollection;
  openModal: TOpenModal;
}) => {
  const optimistic = collection.id === 'optimistic';
  const deleting = collection.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('collections')
    ? pathname
    : pathname + '/collections/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{collection.name}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + collection.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No collections
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new collection.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Collections{' '}
        </Button>
      </div>
    </div>
  );
};
