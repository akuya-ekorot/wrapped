import { Suspense } from 'react';

import Loading from '@/app/loading';
import HeroCollectionList from '@/components/heroCollections/HeroCollectionList';
import { getHeroCollections } from '@/lib/api/heroCollections/queries';
import { getCollections } from '@/lib/api/collections/queries';
import { getHeroLinks } from '@/lib/api/heroLinks/queries';

export const revalidate = 0;

export default async function HeroCollectionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Hero Collections</h1>
        </div>
        <HeroCollections />
      </div>
    </main>
  );
}

const HeroCollections = async () => {
  const { heroCollections } = await getHeroCollections();
  const { collections } = await getCollections();
  const { heroLinks } = await getHeroLinks();
  return (
    <Suspense fallback={<Loading />}>
      <HeroCollectionList
        heroCollections={heroCollections}
        collections={collections}
        heroLinks={heroLinks}
      />
    </Suspense>
  );
};
