import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCollectionImageById } from "@/lib/api/collectionImages/queries";
import { getImages } from "@/lib/api/images/queries";
import { getCollections } from "@/lib/api/collections/queries";import OptimisticCollectionImage from "@/app/(app)/collection-images/[collectionImageId]/OptimisticCollectionImage";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function CollectionImagePage({
  params,
}: {
  params: { collectionImageId: string };
}) {

  return (
    <main className="overflow-auto">
      <CollectionImage id={params.collectionImageId} />
    </main>
  );
}

const CollectionImage = async ({ id }: { id: string }) => {
  
  const { collectionImage } = await getCollectionImageById(id);
  const { images } = await getImages();
  const { collections } = await getCollections();

  if (!collectionImage) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="collection-images" />
        <OptimisticCollectionImage collectionImage={collectionImage} images={images}
        imageId={collectionImage.imageId} collections={collections}
        collectionId={collectionImage.collectionId} />
      </div>
    </Suspense>
  );
};
