'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/variant-images/useOptimisticVariantImages';
import { type VariantImage } from '@/lib/db/schema/variantImages';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import VariantImageForm from '@/components/variantImages/VariantImageForm';
import {
  CompleteProductImage,
  type ProductImage,
  type ProductImageId,
} from '@/lib/db/schema/productImages';
import { type Variant, type VariantId } from '@/lib/db/schema/variants';

export default function OptimisticVariantImage({
  variantImage,
  productImages,
  productImageId,
  variants,
  variantId,
}: {
  variantImage: VariantImage;
  productImages: CompleteProductImage[];
  productImageId?: ProductImageId;
  variants: Variant[];
  variantId?: VariantId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: VariantImage) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticVariantImage, setOptimisticVariantImage] =
    useOptimistic(variantImage);
  const updateVariantImage: TAddOptimistic = (input) =>
    setOptimisticVariantImage({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <VariantImageForm
          variantImage={variantImage}
          productImages={productImages}
          productImageId={productImageId}
          variants={variants}
          variantId={variantId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateVariantImage}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {variantImage.productImageId}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticVariantImage.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticVariantImage, null, 2)}
      </pre>
    </div>
  );
}
