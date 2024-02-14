import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getVariantImageById } from '@/lib/api/variantImages/queries';
import { getProductImages } from '@/lib/api/productImages/queries';
import { getVariants } from '@/lib/api/variants/queries';
import OptimisticVariantImage from './OptimisticVariantImage';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function VariantImagePage({
  params,
}: {
  params: { variantImageId: string };
}) {
  return (
    <main className="overflow-auto">
      <VariantImage id={params.variantImageId} />
    </main>
  );
}

const VariantImage = async ({ id }: { id: string }) => {
  const { variantImage } = await getVariantImageById(id);
  const { productImages } = await getProductImages();
  const { variants } = await getVariants();

  if (!variantImage) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="variant-images" />
        <OptimisticVariantImage
          variantImage={variantImage}
          productImages={productImages}
          variants={variants}
        />
      </div>
    </Suspense>
  );
};
