import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getHeroLinkByIdWithHeroCollectionsAndHeroProducts } from '@/lib/api/heroLinks/queries';
import { getHeroSections } from '@/lib/api/heroSections/queries';
import OptimisticHeroLink from '@/app/(app)/admin/hero-links/[heroLinkId]/OptimisticHeroLink';
import HeroCollectionList from '@/components/heroCollections/HeroCollectionList';
import HeroProductList from '@/components/heroProducts/HeroProductList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getCollections } from '@/lib/api/collections/queries';
import { getProducts } from '@/lib/api/products/queries';

export const revalidate = 0;

export default async function HeroLinkPage({
  params,
}: {
  params: { heroLinkId: string };
}) {
  return (
    <main className="overflow-auto">
      <HeroLink id={params.heroLinkId} />
    </main>
  );
}

const HeroLink = async ({ id }: { id: string }) => {
  const { heroLink, heroCollections, heroProducts } =
    await getHeroLinkByIdWithHeroCollectionsAndHeroProducts(id);
  const { heroSections } = await getHeroSections();
  const { collections } = await getCollections();
  const { products } = await getProducts();

  if (!heroLink) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="hero-links" />
        <OptimisticHeroLink heroLink={heroLink} heroSections={heroSections} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {heroLink.type}&apos;s Hero Collections
        </h3>
        <HeroCollectionList
          collections={collections}
          heroLinks={[]}
          heroLinkId={heroLink.id}
          heroCollections={heroCollections}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {heroLink.type}&apos;s Hero Products
        </h3>
        <HeroProductList
          products={products}
          heroLinks={[]}
          heroLinkId={heroLink.id}
          heroProducts={heroProducts}
        />
      </div>
    </Suspense>
  );
};
