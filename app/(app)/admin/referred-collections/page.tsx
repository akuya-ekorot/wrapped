import { Suspense } from 'react';

import Loading from '@/app/loading';
import ReferredCollectionList from '@/components/referredCollections/ReferredCollectionList';
import { getReferredCollections } from '@/lib/api/referredCollections/queries';
import { getCollections } from '@/lib/api/collections/queries';
import { getMainCollections } from '@/lib/api/mainCollections/queries';

export const revalidate = 0;

export default async function ReferredCollectionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Referred Collections</h1>
        </div>
        <ReferredCollections />
      </div>
    </main>
  );
}

const ReferredCollections = async () => {
  const { referredCollections } = await getReferredCollections();
  const { collections } = await getCollections();
  const { mainCollections } = await getMainCollections();
  return (
    <Suspense fallback={<Loading />}>
      <ReferredCollectionList
        referredCollections={referredCollections}
        collections={collections}
        mainCollections={mainCollections}
      />
    </Suspense>
  );
};
