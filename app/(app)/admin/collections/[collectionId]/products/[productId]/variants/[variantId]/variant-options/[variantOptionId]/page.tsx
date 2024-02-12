import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getVariantOptionById } from '@/lib/api/variantOptions/queries';
import { getOptions } from '@/lib/api/options/queries';
import { getOptionValues } from '@/lib/api/optionValues/queries';
import { getVariants } from '@/lib/api/variants/queries';
import OptimisticVariantOption from '@/app/(app)/admin/variant-options/[variantOptionId]/OptimisticVariantOption';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function VariantOptionPage({
  params,
}: {
  params: { variantOptionId: string };
}) {
  return (
    <main className="overflow-auto">
      <VariantOption id={params.variantOptionId} />
    </main>
  );
}

const VariantOption = async ({ id }: { id: string }) => {
  const { variantOption } = await getVariantOptionById(id);
  const { options } = await getOptions();
  const { optionValues } = await getOptionValues();
  const { variants } = await getVariants();

  if (!variantOption) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="variant-options" />
        <OptimisticVariantOption
          variantOption={variantOption}
          options={options}
          optionId={variantOption.optionId}
          optionValues={optionValues}
          optionValueId={variantOption.optionValueId}
          variants={variants}
          variantId={variantOption.variantId}
        />
      </div>
    </Suspense>
  );
};
