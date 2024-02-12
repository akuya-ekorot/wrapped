'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/collection-images/useOptimisticCollectionImages';
import {
  CompleteCollectionImage,
  type CollectionImage,
} from '@/lib/db/schema/collectionImages';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import CollectionImageForm from '@/components/collectionImages/CollectionImageForm';
import { type TImage, type ImageId } from '@/lib/db/schema/images';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import Image from 'next/image';

export default function OptimisticCollectionImage({
  collectionImage,
  images,
  imageId,
  collections,
  collectionId,
}: {
  collectionImage: CompleteCollectionImage;
  images: TImage[];
  imageId?: ImageId;
  collections: Collection[];
  collectionId?: CollectionId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: CollectionImage) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCollectionImage, setOptimisticCollectionImage] =
    useOptimistic(collectionImage);
  const updateCollectionImage: TAddOptimistic = (input) =>
    setOptimisticCollectionImage({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CollectionImageForm
          collectionImage={collectionImage}
          images={images}
          imageId={imageId}
          collections={collections}
          collectionId={collectionId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateCollectionImage}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {`${collectionImage.collection?.name}'s image`}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticCollectionImage.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        <Image
          src={collectionImage.image?.url ?? ''}
          alt=""
          width={300}
          height={300}
        />
      </pre>
    </div>
  );
}
