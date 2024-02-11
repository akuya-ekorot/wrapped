"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/product-tags/useOptimisticProductTags";
import { type ProductTag } from "@/lib/db/schema/productTags";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ProductTagForm from "@/components/productTags/ProductTagForm";
import { type Tag, type TagId } from "@/lib/db/schema/tags";
import { type Product, type ProductId } from "@/lib/db/schema/products";

export default function OptimisticProductTag({ 
  productTag,
  tags,
  tagId,
  products,
  productId 
}: { 
  productTag: ProductTag; 
  
  tags: Tag[];
  tagId?: TagId
  products: Product[];
  productId?: ProductId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: ProductTag) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticProductTag, setOptimisticProductTag] = useOptimistic(productTag);
  const updateProductTag: TAddOptimistic = (input) =>
    setOptimisticProductTag({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ProductTagForm
          productTag={productTag}
          tags={tags}
        tagId={tagId}
        products={products}
        productId={productId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateProductTag}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{productTag.tagId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticProductTag.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticProductTag, null, 2)}
      </pre>
    </div>
  );
}
