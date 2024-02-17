"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/product-collections/useOptimisticProductCollections";
import { type ProductCollection } from "@/lib/db/schema/productCollections";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ProductCollectionForm from "@/components/productCollections/ProductCollectionForm";
import { type Collection, type CollectionId } from "@/lib/db/schema/collections";
import { type Product, type ProductId } from "@/lib/db/schema/products";

export default function OptimisticProductCollection({ 
  productCollection,
  collections,
  collectionId,
  products,
  productId 
}: { 
  productCollection: ProductCollection; 
  
  collections: Collection[];
  collectionId?: CollectionId
  products: Product[];
  productId?: ProductId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: ProductCollection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticProductCollection, setOptimisticProductCollection] = useOptimistic(productCollection);
  const updateProductCollection: TAddOptimistic = (input) =>
    setOptimisticProductCollection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ProductCollectionForm
          productCollection={optimisticProductCollection}
          collections={collections}
        collectionId={collectionId}
        products={products}
        productId={productId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateProductCollection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticProductCollection.collectionId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticProductCollection.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticProductCollection, null, 2)}
      </pre>
    </div>
  );
}
