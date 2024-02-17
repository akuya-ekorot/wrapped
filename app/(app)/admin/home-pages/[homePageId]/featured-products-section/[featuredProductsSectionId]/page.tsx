import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getFeaturedProductsSectionByIdWithReferredProducts } from '@/lib/api/featuredProductsSection/queries';
import { getHomePages } from '@/lib/api/homePages/queries';
import OptimisticFeaturedProductsSection from '@/app/(app)/admin/featured-products-section/[featuredProductsSectionId]/OptimisticFeaturedProductsSection';
import ReferredProductList from '@/components/referredProducts/ReferredProductList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getProducts } from '@/lib/api/products/queries';

export const revalidate = 0;

export default async function FeaturedProductsSectionPage({
  params,
}: {
  params: { featuredProductsSectionId: string };
}) {
  return (
    <main className="overflow-auto">
      <FeaturedProductsSection id={params.featuredProductsSectionId} />
    </main>
  );
}

const FeaturedProductsSection = async ({ id }: { id: string }) => {
  const { featuredProductsSection, referredProducts } =
    await getFeaturedProductsSectionByIdWithReferredProducts(id);
  const { homePages } = await getHomePages();
  const { products } = await getProducts();

  if (!featuredProductsSection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="featured-products-section" />
        <OptimisticFeaturedProductsSection
          featuredProductsSection={featuredProductsSection}
          homePages={homePages}
          homePageId={featuredProductsSection.homePageId}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">Referred Products</h3>
        <ReferredProductList
          products={products}
          featuredProductsSection={[]}
          featuredProductsSectionId={featuredProductsSection.id}
          referredProducts={referredProducts}
        />
      </div>
    </Suspense>
  );
};
