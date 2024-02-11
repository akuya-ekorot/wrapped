import { Suspense } from 'react';

import Loading from '@/app/loading';
import OptionList from '@/components/options/OptionList';
import { getOptions } from '@/lib/api/options/queries';
import { getProducts } from '@/lib/api/products/queries';

export const revalidate = 0;

export default async function OptionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Options</h1>
        </div>
        <Options />
      </div>
    </main>
  );
}

const Options = async () => {
  const { options } = await getOptions();
  const { products } = await getProducts();
  return (
    <Suspense fallback={<Loading />}>
      <OptionList options={options} products={products} />
    </Suspense>
  );
};
