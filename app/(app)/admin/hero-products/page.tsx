import { Suspense } from 'react';

import Loading from '@/app/loading';
import HeroProductList from '@/components/heroProducts/HeroProductList';
import { getHeroProducts } from '@/lib/api/heroProducts/queries';
import { getProducts } from '@/lib/api/products/queries';
import { getHeroLinks } from '@/lib/api/heroLinks/queries';

export const revalidate = 0;

export default async function HeroProductsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Hero Products</h1>
        </div>
        <HeroProducts />
      </div>
    </main>
  );
}

const HeroProducts = async () => {
  const { heroProducts } = await getHeroProducts();
  const { products } = await getProducts();
  const { heroLinks } = await getHeroLinks();
  return (
    <Suspense fallback={<Loading />}>
      <HeroProductList
        heroProducts={heroProducts}
        products={products}
        heroLinks={heroLinks}
      />
    </Suspense>
  );
};
