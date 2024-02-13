import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getMainCollectionByIdWithReferredCollections } from '@/lib/api/mainCollections/queries';
import { getHomePages } from '@/lib/api/homePages/queries';
import OptimisticMainCollection from '@/app/(app)/admin/main-collections/[mainCollectionId]/OptimisticMainCollection';
import ReferredCollectionList from '@/components/referredCollections/ReferredCollectionList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getCollections } from '@/lib/api/collections/queries';

export const revalidate = 0;

export default async function MainCollectionPage({
  params,
}: {
  params: { mainCollectionId: string };
}) {
  return (
    <main className="overflow-auto">
      <MainCollection id={params.mainCollectionId} />
    </main>
  );
}

const MainCollection = async ({ id }: { id: string }) => {
  const { mainCollection, referredCollections } =
    await getMainCollectionByIdWithReferredCollections(id);
  const { homePages } = await getHomePages();
  const { collections } = await getCollections();

  if (!mainCollection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="main-collections" />
        <OptimisticMainCollection
          mainCollection={mainCollection}
          homePages={homePages}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {mainCollection.title}&apos;s Referred Collections
        </h3>
        <ReferredCollectionList
          collections={collections}
          mainCollections={[]}
          mainCollectionId={mainCollection.id}
          referredCollections={referredCollections}
        />
      </div>
    </Suspense>
  );
};
