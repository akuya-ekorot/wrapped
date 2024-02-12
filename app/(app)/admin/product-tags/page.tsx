import { Suspense } from 'react';

import Loading from '@/app/loading';
import ProductTagList from '@/components/productTags/ProductTagList';
import { getProductTags } from '@/lib/api/productTags/queries';
import { getTags } from '@/lib/api/tags/queries';
import { getProducts } from '@/lib/api/products/queries';

export const revalidate = 0;

export default async function ProductTagsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Product Tags</h1>
        </div>
        <ProductTags />
      </div>
    </main>
  );
}

const ProductTags = async () => {
  const { productTags } = await getProductTags();
  const { tags } = await getTags();
  const { products } = await getProducts();

  return (
    <Suspense fallback={<Loading />}>
      <ProductTagList
        productTags={productTags}
        tags={tags}
        products={products}
      />
    </Suspense>
  );
};
