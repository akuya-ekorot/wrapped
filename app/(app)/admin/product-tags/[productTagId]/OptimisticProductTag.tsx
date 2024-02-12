'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/product-tags/useOptimisticProductTags';
import {
  CompleteProductTag,
  type ProductTag,
} from '@/lib/db/schema/productTags';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import ProductTagForm from '@/components/productTags/ProductTagForm';
import { type Tag, type TagId } from '@/lib/db/schema/tags';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import InfoListItem from '@/components/shared/InfoListItem';

export default function OptimisticProductTag({
  productTag,
  tags,
  tagId,
  products,
  productId,
  tag,
}: {
  productTag: CompleteProductTag;
  tags: Tag[];
  tagId?: TagId;
  products: Product[];
  productId?: ProductId;
  tag?: Tag;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: ProductTag) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticProductTag, setOptimisticProductTag] =
    useOptimistic(productTag);
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
        <h1 className="font-semibold text-2xl">{tag?.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(optimisticProductTag)
          .filter(
            ([key]) =>
              ![
                'id',
                'createdAt',
                'updatedAt',
                'id',
                'tagId',
                'productId',
                'product',
              ].includes(key),
          )
          .map(([key, value]) => (
            //@ts-ignore
            <InfoListItem key={key} title={key} value={value?.name} />
          ))}
      </div>
    </div>
  );
}
