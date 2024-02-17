import { Suspense } from 'react';

import Loading from '@/app/loading';
import LinkToProductList from '@/components/linkToProducts/LinkToProductList';
import { getLinkToProducts } from '@/lib/api/linkToProducts/queries';
import { getProducts } from '@/lib/api/products/queries';
import { getPageLinks } from '@/lib/api/pageLinks/queries';

export const revalidate = 0;

export default async function LinkToProductsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Link To Products</h1>
        </div>
        <LinkToProducts />
      </div>
    </main>
  );
}

const LinkToProducts = async () => {
  const { linkToProducts } = await getLinkToProducts();
  const { products } = await getProducts();
  const { pageLinks } = await getPageLinks();
  return (
    <Suspense fallback={<Loading />}>
      <LinkToProductList
        linkToProducts={linkToProducts}
        products={products}
        pageLinks={pageLinks}
      />
    </Suspense>
  );
};
