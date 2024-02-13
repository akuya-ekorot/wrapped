import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getHeroSectionByIdWithHeroLinks } from '@/lib/api/heroSections/queries';
import { getImages } from '@/lib/api/images/queries';
import { getHomePages } from '@/lib/api/homePages/queries';
import OptimisticHeroSection from '@/app/(app)/admin/hero-sections/[heroSectionId]/OptimisticHeroSection';
import HeroLinkList from '@/components/heroLinks/HeroLinkList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function HeroSectionPage({
  params,
}: {
  params: { heroSectionId: string };
}) {
  return (
    <main className="overflow-auto">
      <HeroSection id={params.heroSectionId} />
    </main>
  );
}

const HeroSection = async ({ id }: { id: string }) => {
  const { heroSection, heroLinks } = await getHeroSectionByIdWithHeroLinks(id);
  const { images } = await getImages();
  const { homePages } = await getHomePages();

  if (!heroSection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="hero-sections" />
        <OptimisticHeroSection
          heroSection={heroSection}
          images={images}
          imageId={heroSection.imageId}
          homePages={homePages}
          homePageId={heroSection.homePageId}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {heroSection.title}&apos;s Hero Links
        </h3>
        <HeroLinkList
          heroSections={[]}
          heroSectionId={heroSection.id}
          heroLinks={heroLinks}
        />
      </div>
    </Suspense>
  );
};
