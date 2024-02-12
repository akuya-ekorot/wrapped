'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/link-to-collections/useOptimisticLinkToCollections';
import { CompleteLinkToCollection } from '@/lib/db/schema/linkToCollections';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import LinkToCollectionForm from '@/components/linkToCollections/LinkToCollectionForm';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { type PageLink, type PageLinkId } from '@/lib/db/schema/pageLinks';
import InfoListItem from '@/components/shared/InfoListItem';

export default function OptimisticLinkToCollection({
  linkToCollection,
  collections,
  collectionId,
  pageLinks,
  pageLinkId,
}: {
  linkToCollection: CompleteLinkToCollection;
  collections: Collection[];
  collectionId?: CollectionId;
  pageLinks: PageLink[];
  pageLinkId?: PageLinkId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: CompleteLinkToCollection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticLinkToCollection, setOptimisticLinkToCollection] =
    useOptimistic(linkToCollection);
  const updateLinkToCollection: TAddOptimistic = (input) =>
    setOptimisticLinkToCollection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <LinkToCollectionForm
          linkToCollection={linkToCollection}
          collections={collections}
          collectionId={collectionId}
          pageLinks={pageLinks}
          pageLinkId={pageLinkId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateLinkToCollection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {linkToCollection.collection?.name}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <InfoListItem
        title={'Collection'}
        value={optimisticLinkToCollection.collection?.name ?? ''}
      />
    </div>
  );
}
