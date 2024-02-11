"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type CollectionImage, CompleteCollectionImage } from "@/lib/db/schema/collectionImages";
import Modal from "@/components/shared/Modal";
import { type Image, type ImageId } from "@/lib/db/schema/images";
import { type Collection, type CollectionId } from "@/lib/db/schema/collections";
import { useOptimisticCollectionImages } from "@/app/(app)/collection-images/useOptimisticCollectionImages";
import { Button } from "@/components/ui/button";
import CollectionImageForm from "./CollectionImageForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (collectionImage?: CollectionImage) => void;

export default function CollectionImageList({
  collectionImages,
  images,
  imageId,
  collections,
  collectionId 
}: {
  collectionImages: CompleteCollectionImage[];
  images: Image[];
  imageId?: ImageId;
  collections: Collection[];
  collectionId?: CollectionId 
}) {
  const { optimisticCollectionImages, addOptimisticCollectionImage } = useOptimisticCollectionImages(
    collectionImages,
    images,
  collections 
  );
  const [open, setOpen] = useState(false);
  const [activeCollectionImage, setActiveCollectionImage] = useState<CollectionImage | null>(null);
  const openModal = (collectionImage?: CollectionImage) => {
    setOpen(true);
    collectionImage ? setActiveCollectionImage(collectionImage) : setActiveCollectionImage(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeCollectionImage ? "Edit CollectionImage" : "Create Collection Image"}
      >
        <CollectionImageForm
          collectionImage={activeCollectionImage}
          addOptimistic={addOptimisticCollectionImage}
          openModal={openModal}
          closeModal={closeModal}
          images={images}
        imageId={imageId}
        collections={collections}
        collectionId={collectionId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticCollectionImages.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticCollectionImages.map((collectionImage) => (
            <CollectionImage
              collectionImage={collectionImage}
              key={collectionImage.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const CollectionImage = ({
  collectionImage,
  openModal,
}: {
  collectionImage: CompleteCollectionImage;
  openModal: TOpenModal;
}) => {
  const optimistic = collectionImage.id === "optimistic";
  const deleting = collectionImage.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("collection-images")
    ? pathname
    : pathname + "/collection-images/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{collectionImage.imageId}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + collectionImage.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No collection images
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new collection image.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Collection Images </Button>
      </div>
    </div>
  );
};
