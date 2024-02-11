import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCollectionByIdWithCollectionImagesAndProducts } from "@/lib/api/collections/queries";
import OptimisticCollection from "./OptimisticCollection";
import CollectionImageList from "@/components/collectionImages/CollectionImageList";
import ProductList from "@/components/products/ProductList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function CollectionPage({
  params,
}: {
  params: { collectionId: string };
}) {

  return (
    <main className="overflow-auto">
      <Collection id={params.collectionId} />
    </main>
  );
}

const Collection = async ({ id }: { id: string }) => {
  
  const { collection, collectionImages, products } = await getCollectionByIdWithCollectionImagesAndProducts(id);
  

  if (!collection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="collections" />
        <OptimisticCollection collection={collection}  />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{collection.name}&apos;s Collection Images</h3>
        <CollectionImageList
          collections={[]}
          collectionId={collection.id}
          collectionImages={collectionImages}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{collection.name}&apos;s Products</h3>
        <ProductList
          collections={[]}
          collectionId={collection.id}
          products={products}
        />
      </div>
    </Suspense>
  );
};
