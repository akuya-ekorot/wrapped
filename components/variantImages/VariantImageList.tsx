'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type VariantImage,
  CompleteVariantImage,
} from '@/lib/db/schema/variantImages';
import Modal from '@/components/shared/Modal';
import {
  type ProductImage,
  type ProductImageId,
} from '@/lib/db/schema/productImages';
import { type Variant, type VariantId } from '@/lib/db/schema/variants';
import { useOptimisticVariantImages } from '@/app/(app)/admin/variant-images/useOptimisticVariantImages';
import { Button } from '@/components/ui/button';
import VariantImageForm from './VariantImageForm';
import { PlusIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { TImage } from '@/lib/db/schema/images';
import Image from 'next/image';

type TOpenModal = (variantImage?: VariantImage) => void;

export default function VariantImageList({
  variantImages,
  productImages,
  productImageId,
  variants,
  variantId,
  images,
}: {
  variantImages: CompleteVariantImage[];
  productImages: ProductImage[];
  productImageId?: ProductImageId;
  variants: Variant[];
  images: TImage[];
  variantId?: VariantId;
}) {
  const { optimisticVariantImages, addOptimisticVariantImage } =
    useOptimisticVariantImages(variantImages, images, productImages, variants);
  const [open, setOpen] = useState(false);
  const [activeVariantImage, setActiveVariantImage] =
    useState<VariantImage | null>(null);
  const openModal = (variantImage?: VariantImage) => {
    setOpen(true);
    variantImage
      ? setActiveVariantImage(variantImage)
      : setActiveVariantImage(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeVariantImage ? 'Edit VariantImage' : 'Create Variant Image'
        }
      >
        <VariantImageForm
          variantImage={activeVariantImage}
          addOptimistic={addOptimisticVariantImage}
          openModal={openModal}
          closeModal={closeModal}
          productImages={productImages}
          productImageId={productImageId}
          variants={variants}
          variantId={variantId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticVariantImages.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul className="relative px-16 mt-8">
          <Carousel>
            <CarouselContent>
              {optimisticVariantImages.map((variantImage) => (
                <CarouselItem key={variantImage.id} className="basis-1/4">
                  <VariantImage
                    variantImage={variantImage}
                    key={variantImage.id}
                    openModal={openModal}
                    image={images.find(
                      (image) => image.id === variantImage.image?.id,
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

const VariantImage = ({
  variantImage,
  openModal,
  image,
}: {
  variantImage: CompleteVariantImage;
  openModal: TOpenModal;
  image?: TImage;
}) => {
  const optimistic = variantImage.id === 'optimistic';
  const deleting = variantImage.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('variant-images')
    ? pathname
    : pathname + '/variant-images/';

  return (
    <li
      className={cn(
        'flex flex-col items-center',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <Image src={image?.url ?? ''} alt="" height={300} width={300} />
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + variantImage.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No variant images
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new variant image.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Variant Images{' '}
        </Button>
      </div>
    </div>
  );
};
