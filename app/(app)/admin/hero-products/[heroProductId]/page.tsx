import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getHeroProductById } from '@/lib/api/heroProducts/queries';
import { getProducts } from '@/lib/api/products/queries';
import { getHeroLinks } from '@/lib/api/heroLinks/queries';
import OptimisticHeroProduct from '@/app/(app)/admin/hero-products/[heroProductId]/OptimisticHeroProduct';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function HeroProductPage({
  params,
}: {
  params: { heroProductId: string };
}) {
  return (
    <main className="overflow-auto">
      <HeroProduct id={params.heroProductId} />
    </main>
  );
}

const HeroProduct = async ({ id }: { id: string }) => {
  const { heroProduct } = await getHeroProductById(id);
  const { products } = await getProducts();
  const { heroLinks } = await getHeroLinks();

  if (!heroProduct) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="hero-products" />
        <OptimisticHeroProduct
          heroProduct={heroProduct}
          products={products}
          heroLinks={heroLinks}
        />
      </div>
    </Suspense>
  );
};
