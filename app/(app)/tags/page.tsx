import { Suspense } from "react";

import Loading from "@/app/loading";
import TagList from "@/components/tags/TagList";
import { getTags } from "@/lib/api/tags/queries";


export const revalidate = 0;

export default async function TagsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Tags</h1>
        </div>
        <Tags />
      </div>
    </main>
  );
}

const Tags = async () => {
  
  const { tags } = await getTags();
  
  return (
    <Suspense fallback={<Loading />}>
      <TagList tags={tags}  />
    </Suspense>
  );
};
