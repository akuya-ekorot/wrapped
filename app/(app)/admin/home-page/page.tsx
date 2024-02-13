import { Suspense } from 'react';

import Loading from '@/app/loading';
import HomePageList from '@/components/homePages/HomePageList';
import { getHomePages } from '@/lib/api/homePages/queries';

export const revalidate = 0;

export default async function HomePagesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Home Pages</h1>
        </div>
        <HomePages />
      </div>
    </main>
  );
}

const HomePages = async () => {
  const { homePages } = await getHomePages();

  return (
    <Suspense fallback={<Loading />}>
      <HomePageList homePages={homePages} />
    </Suspense>
  );
};
