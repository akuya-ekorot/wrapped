import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getPageLinkByIdWithLinkToCollectionsAndLinkToProducts } from '@/lib/api/pageLinks/queries';
import OptimisticPageLink from './OptimisticPageLink';
import LinkToCollectionList from '@/components/linkToCollections/LinkToCollectionList';
import LinkToProductList from '@/components/linkToProducts/LinkToProductList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getCollections } from '@/lib/api/collections/queries';
import { getProducts } from '@/lib/api/products/queries';

export const revalidate = 0;

export default async function PageLinkPage({
  params,
}: {
  params: { pageLinkId: string };
}) {
  return (
    <main className="overflow-auto">
      <PageLink id={params.pageLinkId} />
    </main>
  );
}

const PageLink = async ({ id }: { id: string }) => {
  const { pageLink, linkToCollections, linkToProducts } =
    await getPageLinkByIdWithLinkToCollectionsAndLinkToProducts(id);
  const { collections } = await getCollections();
  const { products } = await getProducts();

  if (!pageLink) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="page-links" />
        <OptimisticPageLink pageLink={pageLink} />
      </div>

      {pageLink.type === 'collections' && (
        <div className="relative mt-8 mx-4">
          <h3 className="text-xl font-medium mb-4">Link To Collections</h3>
          <LinkToCollectionList
            collections={collections}
            pageLinks={[]}
            pageLinkId={pageLink.id}
            linkToCollections={linkToCollections}
          />
        </div>
      )}

      {pageLink.type === 'products' && (
        <div className="relative mt-8 mx-4">
          <h3 className="text-xl font-medium mb-4">Link To Products</h3>
          <LinkToProductList
            products={products}
            pageLinks={[]}
            pageLinkId={pageLink.id}
            linkToProducts={linkToProducts}
          />
        </div>
      )}
    </Suspense>
  );
};
