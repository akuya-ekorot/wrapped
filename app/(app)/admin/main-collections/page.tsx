import { Suspense } from 'react';

import Loading from '@/app/loading';
import MainCollectionList from '@/components/mainCollections/MainCollectionList';
import { getMainCollections } from '@/lib/api/mainCollections/queries';
import { getHomePages } from '@/lib/api/homePages/queries';

export const revalidate = 0;

export default async function MainCollectionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Main Collections</h1>
        </div>
        <MainCollections />
      </div>
    </main>
  );
}

const MainCollections = async () => {
  const { mainCollections } = await getMainCollections();
  const { homePages } = await getHomePages();
  return (
    <Suspense fallback={<Loading />}>
      <MainCollectionList
        mainCollections={mainCollections}
        homePages={homePages}
      />
    </Suspense>
  );
};
