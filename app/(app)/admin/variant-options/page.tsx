import { Suspense } from 'react';

import Loading from '@/app/loading';
import VariantOptionList from '@/components/variantOptions/VariantOptionList';
import { getVariantOptions } from '@/lib/api/variantOptions/queries';
import { getOptions } from '@/lib/api/options/queries';
import { getOptionValues } from '@/lib/api/optionValues/queries';
import { getVariants } from '@/lib/api/variants/queries';

export const revalidate = 0;

export default async function VariantOptionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Variant Options</h1>
        </div>
        <VariantOptions />
      </div>
    </main>
  );
}

const VariantOptions = async () => {
  const { variantOptions } = await getVariantOptions();
  const { options } = await getOptions();
  const { optionValues } = await getOptionValues();
  const { variants } = await getVariants();

  return (
    <Suspense fallback={<Loading />}>
      <VariantOptionList
        variantOptions={variantOptions}
        options={options}
        optionValues={optionValues}
        variants={variants}
      />
    </Suspense>
  );
};
