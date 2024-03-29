'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type TImage as ImageItem,
  CompleteImage,
} from '@/lib/db/schema/images';
import Modal from '@/components/shared/Modal';

import { useOptimisticImages } from '@/app/(app)/admin/images/useOptimisticImages';
import { Button } from '@/components/ui/button';
import ImageForm from './ImageForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (image?: ImageItem) => void;

export default function ImageList({ images }: { images: CompleteImage[] }) {
  const { optimisticImages, addOptimisticImage } = useOptimisticImages(images);
  const [open, setOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<ImageItem | null>(null);
  const openModal = (image?: ImageItem) => {
    setOpen(true);
    image ? setActiveImage(image) : setActiveImage(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeImage ? 'Edit Image' : 'Create Image'}
      >
        <ImageForm
          image={activeImage}
          addOptimistic={addOptimisticImage}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticImages.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticImages.map((image) => (
            <ImageItem image={image} key={image.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const ImageItem = ({
  image,
  openModal,
}: {
  image: CompleteImage;
  openModal: TOpenModal;
}) => {
  const optimistic = image.id === 'optimistic';
  const deleting = image.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('images')
    ? pathname
    : pathname + '/images/';

  return (
    <li
      className={cn(
        'flex flex-col justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{image.url}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + image.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No images
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new image.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Images{' '}
        </Button>
      </div>
    </div>
  );
};
