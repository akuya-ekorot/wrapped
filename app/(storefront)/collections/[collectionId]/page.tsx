import { getCollectionPageDetailsById } from '@/lib/api/collections/queries';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page({
  params: { collectionId },
}: {
  params: { collectionId: string };
}) {
  const collection = await getCollectionPageDetailsById(collectionId);

  if (!collection) {
    return notFound();
  }

  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  return (
    <main>
      <header className="py-8">
        <h1 className="text-2xl text-center">{collection?.name}</h1>
      </header>
      <section className="grid grid-cols-4 p-8">
        {collection.products.map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="space-y-4 hover:underline"
          >
            {product.images.length > 0 ? (
              <Image
                className="object-cover w-[275px] h-[412px]"
                alt={product.name ?? collection?.name}
                src={product.images[0].url}
                height={600}
                width={600}
              />
            ) : (
              <div className="bg-secondary border w-[275px] h-[412px] flex items-center justify-center">
                <ImageOff />
              </div>
            )}

            <div className="text-center">
              <p className="text-lg">{product.name}</p>
              {product.price && (
                <p className="text-lg">{formatter.format(product.price)}</p>
              )}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
