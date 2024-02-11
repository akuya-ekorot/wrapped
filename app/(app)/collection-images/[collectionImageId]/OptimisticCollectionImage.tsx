"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/collection-images/useOptimisticCollectionImages";
import { type CollectionImage } from "@/lib/db/schema/collectionImages";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CollectionImageForm from "@/components/collectionImages/CollectionImageForm";
import { type Image, type ImageId } from "@/lib/db/schema/images";
import { type Collection, type CollectionId } from "@/lib/db/schema/collections";

export default function OptimisticCollectionImage({ 
  collectionImage,
  images,
  imageId,
  collections,
  collectionId 
}: { 
  collectionImage: CollectionImage; 
  
  images: Image[];
  imageId?: ImageId
  collections: Collection[];
  collectionId?: CollectionId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: CollectionImage) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCollectionImage, setOptimisticCollectionImage] = useOptimistic(collectionImage);
  const updateCollectionImage: TAddOptimistic = (input) =>
    setOptimisticCollectionImage({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CollectionImageForm
          collectionImage={collectionImage}
          images={images}
        imageId={imageId}
        collections={collections}
        collectionId={collectionId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateCollectionImage}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{collectionImage.imageId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticCollectionImage.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticCollectionImage, null, 2)}
      </pre>
    </div>
  );
}
