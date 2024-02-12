'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type LinkToCollection,
  CompleteLinkToCollection,
} from '@/lib/db/schema/linkToCollections';
import Modal from '@/components/shared/Modal';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { type PageLink, type PageLinkId } from '@/lib/db/schema/pageLinks';
import { useOptimisticLinkToCollections } from '@/app/(app)/admin/link-to-collections/useOptimisticLinkToCollections';
import { Button } from '@/components/ui/button';
import LinkToCollectionForm from './LinkToCollectionForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (linkToCollection?: LinkToCollection) => void;

export default function LinkToCollectionList({
  linkToCollections,
  collections,
  collectionId,
  pageLinks,
  pageLinkId,
}: {
  linkToCollections: CompleteLinkToCollection[];
  collections: Collection[];
  collectionId?: CollectionId;
  pageLinks: PageLink[];
  pageLinkId?: PageLinkId;
}) {
  const { optimisticLinkToCollections, addOptimisticLinkToCollection } =
    useOptimisticLinkToCollections(linkToCollections, collections, pageLinks);
  const [open, setOpen] = useState(false);
  const [activeLinkToCollection, setActiveLinkToCollection] =
    useState<LinkToCollection | null>(null);
  const openModal = (linkToCollection?: LinkToCollection) => {
    setOpen(true);
    linkToCollection
      ? setActiveLinkToCollection(linkToCollection)
      : setActiveLinkToCollection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeLinkToCollection
            ? 'Edit LinkToCollection'
            : 'Create Link To Collection'
        }
      >
        <LinkToCollectionForm
          linkToCollection={activeLinkToCollection}
          addOptimistic={addOptimisticLinkToCollection}
          openModal={openModal}
          closeModal={closeModal}
          collections={collections}
          collectionId={collectionId}
          pageLinks={pageLinks}
          pageLinkId={pageLinkId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticLinkToCollections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticLinkToCollections.map((linkToCollection) => (
            <LinkToCollection
              linkToCollection={linkToCollection}
              key={linkToCollection.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const LinkToCollection = ({
  linkToCollection,
  openModal,
}: {
  linkToCollection: CompleteLinkToCollection;
  openModal: TOpenModal;
}) => {
  const optimistic = linkToCollection.id === 'optimistic';
  const deleting = linkToCollection.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('link-to-collections')
    ? pathname
    : pathname + '/link-to-collections/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{linkToCollection.collection?.name}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + linkToCollection.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No link to collections
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new link to collection.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Link To Collections{' '}
        </Button>
      </div>
    </div>
  );
};
