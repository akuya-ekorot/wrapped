import { Suspense } from 'react';

import Loading from '@/app/loading';
import ReferredProductList from '@/components/referredProducts/ReferredProductList';
import { getReferredProducts } from '@/lib/api/referredProducts/queries';
import { getProducts } from '@/lib/api/products/queries';
import { getFeaturedProductsSections } from '@/lib/api/featuredProductsSection/queries';

export const revalidate = 0;

export default async function ReferredProductsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Referred Products</h1>
        </div>
        <ReferredProducts />
      </div>
    </main>
  );
}

const ReferredProducts = async () => {
  const { referredProducts } = await getReferredProducts();
  const { products } = await getProducts();
  const { featuredProductsSection } = await getFeaturedProductsSections();
  return (
    <Suspense fallback={<Loading />}>
      <ReferredProductList
        referredProducts={referredProducts}
        products={products}
        featuredProductsSection={featuredProductsSection}
      />
    </Suspense>
  );
};
