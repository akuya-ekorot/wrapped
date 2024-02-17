import { Suspense } from 'react';

import Loading from '@/app/loading';
import PageLinkList from '@/components/pageLinks/PageLinkList';
import { getPageLinks } from '@/lib/api/pageLinks/queries';

export const revalidate = 0;

export default async function PageLinksPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Page Links</h1>
        </div>
        <PageLinks />
      </div>
    </main>
  );
}

const PageLinks = async () => {
  const { pageLinks } = await getPageLinks();

  return (
    <Suspense fallback={<Loading />}>
      <PageLinkList pageLinks={pageLinks} />
    </Suspense>
  );
};
