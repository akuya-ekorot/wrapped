import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getImageById } from '@/lib/api/images/queries';
import OptimisticImage from './OptimisticImage';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function ImagePage({
  params,
}: {
  params: { imageId: string };
}) {
  return (
    <main className="overflow-auto">
      <Image id={params.imageId} />
    </main>
  );
}

const Image = async ({ id }: { id: string }) => {
  const { image } = await getImageById(id);

  if (!image) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="images" />
        <OptimisticImage image={image} />
      </div>
    </Suspense>
  );
};
