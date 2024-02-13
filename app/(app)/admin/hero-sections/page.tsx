import { Suspense } from 'react';

import Loading from '@/app/loading';
import HeroSectionList from '@/components/heroSections/HeroSectionList';
import { getHeroSections } from '@/lib/api/heroSections/queries';
import { getImages } from '@/lib/api/images/queries';
import { getHomePages } from '@/lib/api/homePages/queries';

export const revalidate = 0;

export default async function HeroSectionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Hero Sections</h1>
        </div>
        <HeroSections />
      </div>
    </main>
  );
}

const HeroSections = async () => {
  const { heroSections } = await getHeroSections();
  const { images } = await getImages();
  const { homePages } = await getHomePages();
  return (
    <Suspense fallback={<Loading />}>
      <HeroSectionList
        heroSections={heroSections}
        images={images}
        homePages={homePages}
      />
    </Suspense>
  );
};
