import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getPageByIdWithContentBlocks } from "@/lib/api/pages/queries";
import OptimisticPage from "./OptimisticPage";
import ContentBlockList from "@/components/contentBlocks/ContentBlockList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function PagePage({
  params,
}: {
  params: { pageId: string };
}) {

  return (
    <main className="overflow-auto">
      <Page id={params.pageId} />
    </main>
  );
}

const Page = async ({ id }: { id: string }) => {
  
  const { page, contentBlocks } = await getPageByIdWithContentBlocks(id);
  

  if (!page) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="pages" />
        <OptimisticPage page={page}  />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{page.title}&apos;s Content Blocks</h3>
        <ContentBlockList
          pages={[]}
          pageId={page.id}
          contentBlocks={contentBlocks}
        />
      </div>
    </Suspense>
  );
};
