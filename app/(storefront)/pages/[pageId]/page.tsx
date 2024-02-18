import {
  getPageByIdWithContentBlocks,
  getPages,
} from '@/lib/api/pages/queries';
import { notFound } from 'next/navigation';

export default async function Page({
  params: { pageId },
}: {
  params: { pageId: string };
}) {
  const { page, contentBlocks } = await getPageByIdWithContentBlocks(pageId);

  if (!page) {
    return notFound();
  }

  return (
    <main className="px-16 flex justify-center">
      <div className="max-w-lg w-full">
        <header className="py-8 space-y-1">
          <h1 className="text-3xl font-semibold">{page.title}</h1>
          <p>{page.description}</p>
        </header>
        <div className="space-y-8">
          {contentBlocks.map((block) => (
            <section className="space-y-1" key={block.id}>
              <h2 className="text-xl font-semibold">{block.title}</h2>
              <p>{block.content}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
