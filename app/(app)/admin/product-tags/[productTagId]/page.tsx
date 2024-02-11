import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getProductTagById } from '@/lib/api/productTags/queries';
import { getTags } from '@/lib/api/tags/queries';
import { getProducts } from '@/lib/api/products/queries';
import OptimisticProductTag from '@/app/(app)/admin/product-tags/[productTagId]/OptimisticProductTag';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function ProductTagPage({
  params,
}: {
  params: { productTagId: string };
}) {
  return (
    <main className="overflow-auto">
      <ProductTag id={params.productTagId} />
    </main>
  );
}

const ProductTag = async ({ id }: { id: string }) => {
  const { productTag } = await getProductTagById(id);
  const { tags } = await getTags();
  const { products } = await getProducts();

  if (!productTag) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="product-tags" />
        <OptimisticProductTag
          productTag={productTag}
          tags={tags}
          products={products}
        />
      </div>
    </Suspense>
  );
};
