"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type ProductCollection, CompleteProductCollection } from "@/lib/db/schema/productCollections";
import Modal from "@/components/shared/Modal";
import { type Collection, type CollectionId } from "@/lib/db/schema/collections";
import { type Product, type ProductId } from "@/lib/db/schema/products";
import { useOptimisticProductCollections } from "@/app/(app)/product-collections/useOptimisticProductCollections";
import { Button } from "@/components/ui/button";
import ProductCollectionForm from "./ProductCollectionForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (productCollection?: ProductCollection) => void;

export default function ProductCollectionList({
  productCollections,
  collections,
  collectionId,
  products,
  productId 
}: {
  productCollections: CompleteProductCollection[];
  collections: Collection[];
  collectionId?: CollectionId;
  products: Product[];
  productId?: ProductId 
}) {
  const { optimisticProductCollections, addOptimisticProductCollection } = useOptimisticProductCollections(
    productCollections,
    collections,
  products 
  );
  const [open, setOpen] = useState(false);
  const [activeProductCollection, setActiveProductCollection] = useState<ProductCollection | null>(null);
  const openModal = (productCollection?: ProductCollection) => {
    setOpen(true);
    productCollection ? setActiveProductCollection(productCollection) : setActiveProductCollection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeProductCollection ? "Edit ProductCollection" : "Create Product Collection"}
      >
        <ProductCollectionForm
          productCollection={activeProductCollection}
          addOptimistic={addOptimisticProductCollection}
          openModal={openModal}
          closeModal={closeModal}
          collections={collections}
        collectionId={collectionId}
        products={products}
        productId={productId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticProductCollections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticProductCollections.map((productCollection) => (
            <ProductCollection
              productCollection={productCollection}
              key={productCollection.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const ProductCollection = ({
  productCollection,
  openModal,
}: {
  productCollection: CompleteProductCollection;
  openModal: TOpenModal;
}) => {
  const optimistic = productCollection.id === "optimistic";
  const deleting = productCollection.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("product-collections")
    ? pathname
    : pathname + "/product-collections/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{productCollection.collectionId}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + productCollection.id }>
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
        No product collections
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new product collection.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Product Collections </Button>
      </div>
    </div>
  );
};
