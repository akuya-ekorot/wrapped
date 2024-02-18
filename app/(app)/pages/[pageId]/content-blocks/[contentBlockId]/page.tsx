import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getContentBlockById } from "@/lib/api/contentBlocks/queries";
import { getPages } from "@/lib/api/pages/queries";import OptimisticContentBlock from "@/app/(app)/content-blocks/[contentBlockId]/OptimisticContentBlock";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function ContentBlockPage({
  params,
}: {
  params: { contentBlockId: string };
}) {

  return (
    <main className="overflow-auto">
      <ContentBlock id={params.contentBlockId} />
    </main>
  );
}

const ContentBlock = async ({ id }: { id: string }) => {
  
  const { contentBlock } = await getContentBlockById(id);
  const { pages } = await getPages();

  if (!contentBlock) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="content-blocks" />
        <OptimisticContentBlock contentBlock={contentBlock} pages={pages}
        pageId={contentBlock.pageId} />
      </div>
    </Suspense>
  );
};
