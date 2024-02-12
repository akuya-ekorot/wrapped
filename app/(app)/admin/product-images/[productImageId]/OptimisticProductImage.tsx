'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/product-images/useOptimisticProductImages';
import {
  CompleteProductImage,
  type ProductImage,
} from '@/lib/db/schema/productImages';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import ProductImageForm from '@/components/productImages/ProductImageForm';
import { type TImage, type ImageId } from '@/lib/db/schema/images';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import Image from 'next/image';

export default function OptimisticProductImage({
  productImage,
  images,
  imageId,
  products,
  productId,
}: {
  productImage: CompleteProductImage;
  images: TImage[];
  imageId?: ImageId;
  products: Product[];
  productId?: ProductId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: ProductImage) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticProductImage, setOptimisticProductImage] =
    useOptimistic(productImage);
  const updateProductImage: TAddOptimistic = (input) =>
    setOptimisticProductImage({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ProductImageForm
          productImage={productImage}
          images={images}
          imageId={imageId}
          products={products}
          productId={productId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateProductImage}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {`${productImage.product?.name}'s image`}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticProductImage.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        <Image
          src={productImage.image?.url ?? ''}
          alt=""
          width={300}
          height={300}
        />
      </pre>
    </div>
  );
}
