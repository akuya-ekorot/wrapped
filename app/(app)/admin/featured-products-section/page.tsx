import { Suspense } from 'react';

import Loading from '@/app/loading';
import FeaturedProductsSectionList from '@/components/featuredProductsSection/FeaturedProductsSectionList';
import { getFeaturedProductsSections } from '@/lib/api/featuredProductsSection/queries';
import { getHomePages } from '@/lib/api/homePages/queries';

export const revalidate = 0;

export default async function FeaturedProductsSectionPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">
            Featured Products Section
          </h1>
        </div>
        <FeaturedProductsSection />
      </div>
    </main>
  );
}

const FeaturedProductsSection = async () => {
  const { featuredProductsSection } = await getFeaturedProductsSections();
  const { homePages } = await getHomePages();
  return (
    <Suspense fallback={<Loading />}>
      <FeaturedProductsSectionList
        featuredProductsSection={featuredProductsSection}
        homePages={homePages}
      />
    </Suspense>
  );
};
