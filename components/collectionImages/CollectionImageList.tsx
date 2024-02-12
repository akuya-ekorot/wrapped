'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type CollectionImage,
  CompleteCollectionImage,
} from '@/lib/db/schema/collectionImages';
import Modal from '@/components/shared/Modal';
import { type TImage, type ImageId } from '@/lib/db/schema/images';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { useOptimisticCollectionImages } from '@/app/(app)/admin/collection-images/useOptimisticCollectionImages';
import { Button } from '@/components/ui/button';
import CollectionImageForm from './CollectionImageForm';
import { PlusIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel';
import Image from 'next/image';

type TOpenModal = (collectionImage?: CollectionImage) => void;

export default function CollectionImageList({
  collectionImages,
  images,
  imageId,
  collections,
  collectionId,
}: {
  collectionImages: CompleteCollectionImage[];
  images: TImage[];
  imageId?: ImageId;
  collections: Collection[];
  collectionId?: CollectionId;
}) {
  const { optimisticCollectionImages, addOptimisticCollectionImage } =
    useOptimisticCollectionImages(collectionImages, images, collections);
  const [open, setOpen] = useState(false);
  const [activeCollectionImage, setActiveCollectionImage] =
    useState<CollectionImage | null>(null);
  const openModal = (collectionImage?: CollectionImage) => {
    setOpen(true);
    collectionImage
      ? setActiveCollectionImage(collectionImage)
      : setActiveCollectionImage(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeCollectionImage
            ? 'Edit CollectionImage'
            : 'Create Collection Image'
        }
      >
        <CollectionImageForm
          collectionImage={activeCollectionImage}
          addOptimistic={addOptimisticCollectionImage}
          openModal={openModal}
          closeModal={closeModal}
          images={images}
          imageId={imageId}
          collections={collections}
          collectionId={collectionId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticCollectionImages.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul className="relative px-16 mt-8">
          <Carousel>
            <CarouselContent>
              {optimisticCollectionImages.map((collectionImage) => (
                <CarouselItem key={collectionImage.id} className="basis-1/4">
                  <CollectionImage
                    collectionImage={collectionImage}
                    key={collectionImage.id}
                    openModal={openModal}
                    image={images.find(
                      (image) => image.id === collectionImage.imageId,
                    )}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </ul>
      )}
    </div>
  );
}

const CollectionImage = ({
  collectionImage,
  openModal,
  image,
}: {
  collectionImage: CompleteCollectionImage;
  openModal: TOpenModal;
  image?: TImage;
}) => {
  const optimistic = collectionImage.id === 'optimistic';
  const deleting = collectionImage.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('collection-images')
    ? pathname
    : pathname + '/collection-images/';

  return (
    <li
      className={cn(
        'flex flex-col items-center',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <Image
          src={image?.url ?? collectionImage.imageId}
          alt=""
          width={300}
          height={300}
        />
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + collectionImage.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No collection images
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new collection image.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Collection Images{' '}
        </Button>
      </div>
    </div>
  );
};
