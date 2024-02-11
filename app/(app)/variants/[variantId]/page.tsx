import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getVariantByIdWithVariantOptions } from '@/lib/api/variants/queries';
import { getProducts } from '@/lib/api/products/queries';
import OptimisticVariant from './OptimisticVariant';
import VariantOptionList from '@/components/variantOptions/VariantOptionList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function VariantPage({
  params,
}: {
  params: { variantId: string };
}) {
  return (
    <main className="overflow-auto">
      <Variant id={params.variantId} />
    </main>
  );
}

const Variant = async ({ id }: { id: string }) => {
  const { variant, variantOptions } =
    await getVariantByIdWithVariantOptions(id);
  const { products } = await getProducts();

  if (!variant) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="variants" />
        <OptimisticVariant variant={variant} products={products} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {variant.productId}&apos;s Variant Options
        </h3>
        <VariantOptionList
          variants={[]}
          variantId={variant.id}
          variantOptions={variantOptions}
        />
      </div>
    </Suspense>
  );
};
