import { Suspense } from 'react';

import Loading from '@/app/loading';
import LinkToCollectionList from '@/components/linkToCollections/LinkToCollectionList';
import { getLinkToCollections } from '@/lib/api/linkToCollections/queries';
import { getCollections } from '@/lib/api/collections/queries';
import { getPageLinks } from '@/lib/api/pageLinks/queries';

export const revalidate = 0;

export default async function LinkToCollectionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Link To Collections</h1>
        </div>
        <LinkToCollections />
      </div>
    </main>
  );
}

const LinkToCollections = async () => {
  const { linkToCollections } = await getLinkToCollections();
  const { collections } = await getCollections();
  const { pageLinks } = await getPageLinks();
  return (
    <Suspense fallback={<Loading />}>
      <LinkToCollectionList
        linkToCollections={linkToCollections}
        collections={collections}
        pageLinks={pageLinks}
      />
    </Suspense>
  );
};
