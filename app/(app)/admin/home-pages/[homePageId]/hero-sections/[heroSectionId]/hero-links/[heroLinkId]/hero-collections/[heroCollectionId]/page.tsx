import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getHeroCollectionById } from '@/lib/api/heroCollections/queries';
import { getCollections } from '@/lib/api/collections/queries';
import { getHeroLinks } from '@/lib/api/heroLinks/queries';
import OptimisticHeroCollection from '@/app/(app)/admin/hero-collections/[heroCollectionId]/OptimisticHeroCollection';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function HeroCollectionPage({
  params,
}: {
  params: { heroCollectionId: string };
}) {
  return (
    <main className="overflow-auto">
      <HeroCollection id={params.heroCollectionId} />
    </main>
  );
}

const HeroCollection = async ({ id }: { id: string }) => {
  const { heroCollection } = await getHeroCollectionById(id);
  const { collections } = await getCollections();
  const { heroLinks } = await getHeroLinks();

  if (!heroCollection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="hero-collections" />
        <OptimisticHeroCollection
          heroCollection={heroCollection}
          collections={collections}
          collectionId={heroCollection.collectionId}
          heroLinks={heroLinks}
          heroLinkId={heroCollection.heroLinkId}
        />
      </div>
    </Suspense>
  );
};
