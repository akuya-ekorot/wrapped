'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type ProductImage,
  CompleteProductImage,
} from '@/lib/db/schema/productImages';
import Modal from '@/components/shared/Modal';
import { type Image, type ImageId } from '@/lib/db/schema/images';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import { useOptimisticProductImages } from '@/app/(app)/admin/product-images/useOptimisticProductImages';
import { Button } from '@/components/ui/button';
import ProductImageForm from './ProductImageForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (productImage?: ProductImage) => void;

export default function ProductImageList({
  productImages,
  images,
  imageId,
  products,
  productId,
}: {
  productImages: CompleteProductImage[];
  images: Image[];
  imageId?: ImageId;
  products: Product[];
  productId?: ProductId;
}) {
  const { optimisticProductImages, addOptimisticProductImage } =
    useOptimisticProductImages(productImages, images, products);
  const [open, setOpen] = useState(false);
  const [activeProductImage, setActiveProductImage] =
    useState<ProductImage | null>(null);
  const openModal = (productImage?: ProductImage) => {
    setOpen(true);
    productImage
      ? setActiveProductImage(productImage)
      : setActiveProductImage(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeProductImage ? 'Edit ProductImage' : 'Create Product Image'
        }
      >
        <ProductImageForm
          productImage={activeProductImage}
          addOptimistic={addOptimisticProductImage}
          openModal={openModal}
          closeModal={closeModal}
          images={images}
          imageId={imageId}
          products={products}
          productId={productId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticProductImages.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticProductImages.map((productImage) => (
            <ProductImage
              productImage={productImage}
              key={productImage.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const ProductImage = ({
  productImage,
  openModal,
}: {
  productImage: CompleteProductImage;
  openModal: TOpenModal;
}) => {
  const optimistic = productImage.id === 'optimistic';
  const deleting = productImage.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('product-images')
    ? pathname
    : pathname + '/product-images/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{productImage.imageId}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + productImage.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No product images
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new product image.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Product Images{' '}
        </Button>
      </div>
    </div>
  );
};
