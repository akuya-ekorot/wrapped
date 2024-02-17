import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getProductCollectionById } from '@/lib/api/productCollections/queries';
import { getCollections } from '@/lib/api/collections/queries';
import { getProducts } from '@/lib/api/products/queries';
import OptimisticProductCollection from './OptimisticProductCollection';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function ProductCollectionPage({
  params,
}: {
  params: { productCollectionId: string };
}) {
  return (
    <main className="overflow-auto">
      <ProductCollection id={params.productCollectionId} />
    </main>
  );
}

const ProductCollection = async ({ id }: { id: string }) => {
  const { productCollection } = await getProductCollectionById(id);
  const { collections } = await getCollections();
  const { products } = await getProducts();

  if (!productCollection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="product-collections" />
        <OptimisticProductCollection
          productCollection={productCollection}
          collections={collections}
          products={products}
        />
      </div>
    </Suspense>
  );
};
