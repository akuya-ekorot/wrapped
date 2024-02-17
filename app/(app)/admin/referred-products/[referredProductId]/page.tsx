import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getReferredProductById } from '@/lib/api/referredProducts/queries';
import { getProducts } from '@/lib/api/products/queries';
import { getFeaturedProductsSections } from '@/lib/api/featuredProductsSection/queries';
import OptimisticReferredProduct from '@/app/(app)/admin/referred-products/[referredProductId]/OptimisticReferredProduct';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function ReferredProductPage({
  params,
}: {
  params: { referredProductId: string };
}) {
  return (
    <main className="overflow-auto">
      <ReferredProduct id={params.referredProductId} />
    </main>
  );
}

const ReferredProduct = async ({ id }: { id: string }) => {
  const { referredProduct } = await getReferredProductById(id);
  const { products } = await getProducts();
  const { featuredProductsSection } = await getFeaturedProductsSections();

  if (!referredProduct) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="referred-products" />
        <OptimisticReferredProduct
          referredProduct={referredProduct}
          products={products}
          featuredProductsSection={featuredProductsSection}
        />
      </div>
    </Suspense>
  );
};
