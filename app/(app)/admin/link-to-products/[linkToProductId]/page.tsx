import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getLinkToProductById } from '@/lib/api/linkToProducts/queries';
import { getProducts } from '@/lib/api/products/queries';
import { getPageLinks } from '@/lib/api/pageLinks/queries';
import OptimisticLinkToProduct from '@/app/(app)/admin/link-to-products/[linkToProductId]/OptimisticLinkToProduct';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function LinkToProductPage({
  params,
}: {
  params: { linkToProductId: string };
}) {
  return (
    <main className="overflow-auto">
      <LinkToProduct id={params.linkToProductId} />
    </main>
  );
}

const LinkToProduct = async ({ id }: { id: string }) => {
  const { linkToProduct } = await getLinkToProductById(id);
  const { products } = await getProducts();
  const { pageLinks } = await getPageLinks();

  if (!linkToProduct) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="link-to-products" />
        <OptimisticLinkToProduct
          linkToProduct={linkToProduct}
          products={products}
          pageLinks={pageLinks}
        />
      </div>
    </Suspense>
  );
};
