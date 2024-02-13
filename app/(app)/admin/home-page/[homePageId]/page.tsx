import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getHomePageByIdWithHeroSectionsAndMainCollectionsAndFeaturedCollectionSectionsAndFeaturedProductsSection } from '@/lib/api/homePages/queries';
import OptimisticHomePage from './OptimisticHomePage';
import HeroSectionList from '@/components/heroSections/HeroSectionList';
import MainCollectionList from '@/components/mainCollections/MainCollectionList';
import FeaturedCollectionSectionList from '@/components/featuredCollectionSections/FeaturedCollectionSectionList';
import FeaturedProductsSectionList from '@/components/featuredProductsSection/FeaturedProductsSectionList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getImages } from '@/lib/api/images/queries';
import { getCollections } from '@/lib/api/collections/queries';

export const revalidate = 0;

export default async function HomePagePage({
  params,
}: {
  params: { homePageId: string };
}) {
  return (
    <main className="overflow-auto">
      <HomePage id={params.homePageId} />
    </main>
  );
}

const HomePage = async ({ id }: { id: string }) => {
  const {
    homePage,
    heroSections,
    mainCollections,
    featuredCollectionSections,
    featuredProductsSection,
  } =
    await getHomePageByIdWithHeroSectionsAndMainCollectionsAndFeaturedCollectionSectionsAndFeaturedProductsSection(
      id,
    );
  const { images } = await getImages();
  const { collections } = await getCollections();

  if (!homePage) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="home-pages" />
        <OptimisticHomePage homePage={homePage} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {homePage.title}&apos;s Hero Sections
        </h3>
        <HeroSectionList
          images={images}
          homePages={[]}
          homePageId={homePage.id}
          heroSections={heroSections}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {homePage.title}&apos;s Main Collections
        </h3>
        <MainCollectionList
          homePages={[]}
          homePageId={homePage.id}
          mainCollections={mainCollections}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {homePage.title}&apos;s Featured Collection Sections
        </h3>
        <FeaturedCollectionSectionList
          collections={collections}
          images={images}
          homePages={[]}
          homePageId={homePage.id}
          featuredCollectionSections={featuredCollectionSections}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {homePage.title}&apos;s Featured Products Section
        </h3>
        <FeaturedProductsSectionList
          homePages={[]}
          homePageId={homePage.id}
          featuredProductsSection={featuredProductsSection}
        />
      </div>
    </Suspense>
  );
};
