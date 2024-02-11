import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getProductByIdWithProductImagesAndOptionsAndProductTags } from '@/lib/api/products/queries';
import { getCollections } from '@/lib/api/collections/queries';
import OptimisticProduct from '@/app/(app)/admin/products/[productId]/OptimisticProduct';
import ProductImageList from '@/components/productImages/ProductImageList';
import OptionList from '@/components/options/OptionList';
import ProductTagList from '@/components/productTags/ProductTagList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getImages } from '@/lib/api/images/queries';
import { getTags } from '@/lib/api/tags/queries';

export const revalidate = 0;

export default async function ProductPage({
  params,
}: {
  params: { productId: string };
}) {
  return (
    <main className="overflow-auto">
      <Product id={params.productId} />
    </main>
  );
}

const Product = async ({ id }: { id: string }) => {
  const { product, productImages, options, productTags } =
    await getProductByIdWithProductImagesAndOptionsAndProductTags(id);
  const { collections } = await getCollections();
  const { images } = await getImages();
  const { tags } = await getTags();

  if (!product) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="products" />
        <OptimisticProduct
          product={product}
          collections={collections}
          collectionId={product.collectionId}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {product.name}&apos;s Product Images
        </h3>
        <ProductImageList
          images={images}
          products={[]}
          productId={product.id}
          productImages={productImages}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {product.name}&apos;s Options
        </h3>
        <OptionList products={[]} productId={product.id} options={options} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {product.name}&apos;s Product Tags
        </h3>
        <ProductTagList
          tags={tags}
          products={[]}
          productId={product.id}
          productTags={productTags}
        />
      </div>
    </Suspense>
  );
};
