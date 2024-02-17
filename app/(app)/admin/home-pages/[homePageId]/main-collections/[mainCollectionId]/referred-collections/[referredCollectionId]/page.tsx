import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getReferredCollectionById } from '@/lib/api/referredCollections/queries';
import { getCollections } from '@/lib/api/collections/queries';
import { getMainCollections } from '@/lib/api/mainCollections/queries';
import OptimisticReferredCollection from '@/app/(app)/admin/referred-collections/[referredCollectionId]/OptimisticReferredCollection';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function ReferredCollectionPage({
  params,
}: {
  params: { referredCollectionId: string };
}) {
  return (
    <main className="overflow-auto">
      <ReferredCollection id={params.referredCollectionId} />
    </main>
  );
}

const ReferredCollection = async ({ id }: { id: string }) => {
  const { referredCollection } = await getReferredCollectionById(id);
  const { collections } = await getCollections();
  const { mainCollections } = await getMainCollections();

  if (!referredCollection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="referred-collections" />
        <OptimisticReferredCollection
          referredCollection={referredCollection}
          collections={collections}
          collectionId={referredCollection.collectionId}
          mainCollections={mainCollections}
          mainCollectionId={referredCollection.mainCollectionId}
        />
      </div>
    </Suspense>
  );
};
