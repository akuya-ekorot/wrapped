import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getProductImageById } from '@/lib/api/productImages/queries';
import { getImages } from '@/lib/api/images/queries';
import { getProducts } from '@/lib/api/products/queries';
import OptimisticProductImage from '@/app/(app)/product-images/[productImageId]/OptimisticProductImage';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function ProductImagePage({
  params,
}: {
  params: { productImageId: string };
}) {
  return (
    <main className="overflow-auto">
      <ProductImage id={params.productImageId} />
    </main>
  );
}

const ProductImage = async ({ id }: { id: string }) => {
  const { productImage } = await getProductImageById(id);
  const { images } = await getImages();
  const { products } = await getProducts();

  if (!productImage) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="product-images" />
        <OptimisticProductImage
          productImage={productImage}
          images={images}
          products={products}
        />
      </div>
    </Suspense>
  );
};
