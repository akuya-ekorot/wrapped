import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getLinkToCollectionById } from '@/lib/api/linkToCollections/queries';
import { getCollections } from '@/lib/api/collections/queries';
import { getPageLinks } from '@/lib/api/pageLinks/queries';
import OptimisticLinkToCollection from '@/app/(app)/admin/link-to-collections/[linkToCollectionId]/OptimisticLinkToCollection';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function LinkToCollectionPage({
  params,
}: {
  params: { linkToCollectionId: string };
}) {
  return (
    <main className="overflow-auto">
      <LinkToCollection id={params.linkToCollectionId} />
    </main>
  );
}

const LinkToCollection = async ({ id }: { id: string }) => {
  const { linkToCollection } = await getLinkToCollectionById(id);
  const { collections } = await getCollections();
  const { pageLinks } = await getPageLinks();

  if (!linkToCollection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="link-to-collections" />
        <OptimisticLinkToCollection
          linkToCollection={linkToCollection}
          collections={collections}
          pageLinks={pageLinks}
        />
      </div>
    </Suspense>
  );
};
