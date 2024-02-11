import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getTagById } from '@/lib/api/tags/queries';
import OptimisticTag from './OptimisticTag';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function TagPage({
  params,
}: {
  params: { tagId: string };
}) {
  return (
    <main className="overflow-auto">
      <Tag id={params.tagId} />
    </main>
  );
}

const Tag = async ({ id }: { id: string }) => {
  const { tag } = await getTagById(id);

  if (!tag) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="tags" />
        <OptimisticTag tag={tag} />
      </div>
    </Suspense>
  );
};
