import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import {
  getCollectionByIdWithCollectionImagesAndProducts,
  getCollections,
} from '@/lib/api/collections/queries';
import CollectionImageList from '@/components/collectionImages/CollectionImageList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getImages } from '@/lib/api/images/queries';
import ProductCollectionList from '@/components/productCollections/ProductCollectionList';
import { getProductCollectionsByCollectionId } from '@/lib/api/productCollections/queries';
import { getProducts } from '@/lib/api/products/queries';
import OptimisticCollection from '@/app/(app)/admin/collections/[collectionId]/OptimisticCollection';

export const revalidate = 0;

export default async function CollectionPage({
  params,
}: {
  params: { collectionId: string };
}) {
  return (
    <main className="overflow-auto">
      <Collection id={params.collectionId} />
    </main>
  );
}

const Collection = async ({ id }: { id: string }) => {
  const { collection, collectionImages } =
    await getCollectionByIdWithCollectionImagesAndProducts(id);
  const { images } = await getImages();
  const { productCollections } = await getProductCollectionsByCollectionId(id);
  const { collections } = await getCollections();
  const { products } = await getProducts();

  if (!collection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="collections" />
        <OptimisticCollection collection={collection} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {collection.name}&apos;s Collection Images
        </h3>
        <CollectionImageList
          images={images}
          collections={[]}
          collectionId={collection.id}
          collectionImages={collectionImages}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {collection.name}&apos;s Products
        </h3>
        <ProductCollectionList
          products={products}
          collections={collections}
          collectionId={id}
          productCollections={productCollections}
        />
      </div>
    </Suspense>
  );
};
