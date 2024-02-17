import { Suspense } from 'react';

import Loading from '@/app/loading';
import FeaturedCollectionSectionList from '@/components/featuredCollectionSections/FeaturedCollectionSectionList';
import { getFeaturedCollectionSections } from '@/lib/api/featuredCollectionSections/queries';
import { getImages } from '@/lib/api/images/queries';
import { getCollections } from '@/lib/api/collections/queries';
import { getHomePages } from '@/lib/api/homePages/queries';

export const revalidate = 0;

export default async function FeaturedCollectionSectionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">
            Featured Collection Sections
          </h1>
        </div>
        <FeaturedCollectionSections />
      </div>
    </main>
  );
}

const FeaturedCollectionSections = async () => {
  const { featuredCollectionSections } = await getFeaturedCollectionSections();
  const { images } = await getImages();
  const { collections } = await getCollections();
  const { homePages } = await getHomePages();
  return (
    <Suspense fallback={<Loading />}>
      <FeaturedCollectionSectionList
        featuredCollectionSections={featuredCollectionSections}
        images={images}
        collections={collections}
        homePages={homePages}
      />
    </Suspense>
  );
};
