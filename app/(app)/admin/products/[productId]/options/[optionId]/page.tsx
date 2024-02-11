import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getOptionByIdWithOptionValues } from '@/lib/api/options/queries';
import { getProducts } from '@/lib/api/products/queries';
import OptimisticOption from '@/app/(app)/admin/options/[optionId]/OptimisticOption';
import OptionValueList from '@/components/optionValues/OptionValueList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function OptionPage({
  params,
}: {
  params: { optionId: string };
}) {
  return (
    <main className="overflow-auto">
      <Option id={params.optionId} />
    </main>
  );
}

const Option = async ({ id }: { id: string }) => {
  const { option, optionValues } = await getOptionByIdWithOptionValues(id);
  const { products } = await getProducts();

  if (!option) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="options" />
        <OptimisticOption
          option={option}
          products={products}
          productId={option.productId}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {option.name}&apos;s Option Values
        </h3>
        <OptionValueList
          options={[]}
          optionId={option.id}
          optionValues={optionValues}
        />
      </div>
    </Suspense>
  );
};
