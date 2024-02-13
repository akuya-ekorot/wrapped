import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getFeaturedCollectionSectionById } from '@/lib/api/featuredCollectionSections/queries';
import { getImages } from '@/lib/api/images/queries';
import { getCollections } from '@/lib/api/collections/queries';
import { getHomePages } from '@/lib/api/homePages/queries';
import OptimisticFeaturedCollectionSection from '@/app/(app)/admin/featured-collection-sections/[featuredCollectionSectionId]/OptimisticFeaturedCollectionSection';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function FeaturedCollectionSectionPage({
  params,
}: {
  params: { featuredCollectionSectionId: string };
}) {
  return (
    <main className="overflow-auto">
      <FeaturedCollectionSection id={params.featuredCollectionSectionId} />
    </main>
  );
}

const FeaturedCollectionSection = async ({ id }: { id: string }) => {
  const { featuredCollectionSection } =
    await getFeaturedCollectionSectionById(id);
  const { images } = await getImages();
  const { collections } = await getCollections();
  const { homePages } = await getHomePages();

  if (!featuredCollectionSection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="featured-collection-sections" />
        <OptimisticFeaturedCollectionSection
          featuredCollectionSection={featuredCollectionSection}
          images={images}
          collections={collections}
          homePages={homePages}
        />
      </div>
    </Suspense>
  );
};
