import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getVariantByIdWithVariantOptions } from '@/lib/api/variants/queries';
import { getProducts } from '@/lib/api/products/queries';
import VariantOptionList from '@/components/variantOptions/VariantOptionList';
import OptimisticVariant from '@/app/(app)/admin/variants/[variantId]/OptimisticVariant';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getOptions } from '@/lib/api/options/queries';
import { getOptionValues } from '@/lib/api/optionValues/queries';

export const revalidate = 0;

export default async function VariantPage({
  params,
}: {
  params: { variantId: string; productId: string };
}) {
  return (
    <main className="overflow-auto">
      <Variant id={params.variantId} productId={params.productId} />
    </main>
  );
}

const Variant = async ({
  id,
  productId,
}: {
  id: string;
  productId: string;
}) => {
  const { variant, variantOptions } =
    await getVariantByIdWithVariantOptions(id);
  const { products } = await getProducts();
  const { options } = await getOptions();
  const { optionValues } = await getOptionValues();

  if (!variant) notFound();

  const productOptions = options.filter((o) => o.productId === productId);
  const productOptionValues = optionValues.filter(
    (ov) => ov.option?.productId === productId,
  );

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="variants" />
        <OptimisticVariant variant={variant} products={products} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {variant.name}&apos;s Variant Options
        </h3>
        <VariantOptionList
          productId={productId}
          options={productOptions}
          optionValues={productOptionValues}
          variants={[]}
          variantId={variant.id}
          variantOptions={variantOptions}
        />
      </div>
    </Suspense>
  );
};
