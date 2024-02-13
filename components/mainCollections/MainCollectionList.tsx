'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type MainCollection,
  CompleteMainCollection,
} from '@/lib/db/schema/mainCollections';
import Modal from '@/components/shared/Modal';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';
import { useOptimisticMainCollections } from '@/app/(app)/admin/main-collections/useOptimisticMainCollections';
import { Button } from '@/components/ui/button';
import MainCollectionForm from './MainCollectionForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (mainCollection?: MainCollection) => void;

export default function MainCollectionList({
  mainCollections,
  homePages,
  homePageId,
}: {
  mainCollections: CompleteMainCollection[];
  homePages: HomePage[];
  homePageId?: HomePageId;
}) {
  const { optimisticMainCollections, addOptimisticMainCollection } =
    useOptimisticMainCollections(mainCollections, homePages);
  const [open, setOpen] = useState(false);
  const [activeMainCollection, setActiveMainCollection] =
    useState<MainCollection | null>(null);
  const openModal = (mainCollection?: MainCollection) => {
    setOpen(true);
    mainCollection
      ? setActiveMainCollection(mainCollection)
      : setActiveMainCollection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeMainCollection
            ? 'Edit MainCollection'
            : 'Create Main Collection'
        }
      >
        <MainCollectionForm
          mainCollection={activeMainCollection}
          addOptimistic={addOptimisticMainCollection}
          openModal={openModal}
          closeModal={closeModal}
          homePages={homePages}
          homePageId={homePageId}
        />
      </Modal>
      {optimisticMainCollections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticMainCollections.map((mainCollection) => (
            <MainCollection
              mainCollection={mainCollection}
              key={mainCollection.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const MainCollection = ({
  mainCollection,
  openModal,
}: {
  mainCollection: CompleteMainCollection;
  openModal: TOpenModal;
}) => {
  const optimistic = mainCollection.id === 'optimistic';
  const deleting = mainCollection.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('main-collections')
    ? pathname
    : pathname + '/main-collections/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{mainCollection.title}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + mainCollection.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No main collections
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new main collection.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Main Collections{' '}
        </Button>
      </div>
    </div>
  );
};
