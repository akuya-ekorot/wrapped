import { Suspense } from 'react';

import Loading from '@/app/loading';
import CollectionImageList from '@/components/collectionImages/CollectionImageList';
import { getCollectionImages } from '@/lib/api/collectionImages/queries';
import { getImages } from '@/lib/api/images/queries';
import { getCollections } from '@/lib/api/collections/queries';

export const revalidate = 0;

export default async function CollectionImagesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Collection Images</h1>
        </div>
        <CollectionImages />
      </div>
    </main>
  );
}

const CollectionImages = async () => {
  const { collectionImages } = await getCollectionImages();
  const { images } = await getImages();
  const { collections } = await getCollections();
  return (
    <Suspense fallback={<Loading />}>
      <CollectionImageList
        collectionImages={collectionImages}
        images={images}
        collections={collections}
      />
    </Suspense>
  );
};
