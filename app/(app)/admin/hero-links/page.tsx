import { Suspense } from 'react';

import Loading from '@/app/loading';
import HeroLinkList from '@/components/heroLinks/HeroLinkList';
import { getHeroLinks } from '@/lib/api/heroLinks/queries';
import { getHeroSections } from '@/lib/api/heroSections/queries';

export const revalidate = 0;

export default async function HeroLinksPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Hero Links</h1>
        </div>
        <HeroLinks />
      </div>
    </main>
  );
}

const HeroLinks = async () => {
  const { heroLinks } = await getHeroLinks();
  const { heroSections } = await getHeroSections();
  return (
    <Suspense fallback={<Loading />}>
      <HeroLinkList heroLinks={heroLinks} heroSections={heroSections} />
    </Suspense>
  );
};
