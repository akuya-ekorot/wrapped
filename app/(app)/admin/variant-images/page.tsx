import { Suspense } from 'react';

import Loading from '@/app/loading';
import VariantImageList from '@/components/variantImages/VariantImageList';
import { getVariantImages } from '@/lib/api/variantImages/queries';
import { getProductImages } from '@/lib/api/productImages/queries';
import { getVariants } from '@/lib/api/variants/queries';

export const revalidate = 0;

export default async function VariantImagesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Variant Images</h1>
        </div>
        <VariantImages />
      </div>
    </main>
  );
}

const VariantImages = async () => {
  const { variantImages } = await getVariantImages();
  const { productImages } = await getProductImages();
  const { variants } = await getVariants();
  return (
    <Suspense fallback={<Loading />}>
      <VariantImageList
        variantImages={variantImages}
        productImages={productImages}
        variants={variants}
      />
    </Suspense>
  );
};
