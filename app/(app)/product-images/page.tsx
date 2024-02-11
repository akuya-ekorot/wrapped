import { Suspense } from 'react';

import Loading from '@/app/loading';
import ProductImageList from '@/components/productImages/ProductImageList';
import { getProductImages } from '@/lib/api/productImages/queries';
import { getImages } from '@/lib/api/images/queries';
import { getProducts } from '@/lib/api/products/queries';

export const revalidate = 0;

export default async function ProductImagesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Product Images</h1>
        </div>
        <ProductImages />
      </div>
    </main>
  );
}

const ProductImages = async () => {
  const { productImages } = await getProductImages();
  const { images } = await getImages();
  const { products } = await getProducts();
  return (
    <Suspense fallback={<Loading />}>
      <ProductImageList
        productImages={productImages}
        images={images}
        products={products}
      />
    </Suspense>
  );
};
