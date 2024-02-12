'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type ProductTag,
  CompleteProductTag,
} from '@/lib/db/schema/productTags';
import Modal from '@/components/shared/Modal';
import { type Tag, type TagId } from '@/lib/db/schema/tags';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import { useOptimisticProductTags } from '@/app/(app)/admin/product-tags/useOptimisticProductTags';
import { Button } from '@/components/ui/button';
import ProductTagForm from './ProductTagForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (productTag?: ProductTag) => void;

export default function ProductTagList({
  productTags,
  tags,
  tagId,
  products,
  productId,
}: {
  productTags: CompleteProductTag[];
  tags: Tag[];
  tagId?: TagId;
  products: Product[];
  productId?: ProductId;
}) {
  const { optimisticProductTags, addOptimisticProductTag } =
    useOptimisticProductTags(productTags, tags, products);
  const [open, setOpen] = useState(false);
  const [activeProductTag, setActiveProductTag] = useState<ProductTag | null>(
    null,
  );
  const openModal = (productTag?: ProductTag) => {
    setOpen(true);
    productTag ? setActiveProductTag(productTag) : setActiveProductTag(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeProductTag ? 'Edit ProductTag' : 'Create Product Tag'}
      >
        <ProductTagForm
          productTag={activeProductTag}
          addOptimistic={addOptimisticProductTag}
          openModal={openModal}
          closeModal={closeModal}
          tags={tags}
          tagId={tagId}
          products={products}
          productId={productId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticProductTags.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticProductTags.map((productTag) => (
            <ProductTag
              productTag={productTag}
              key={productTag.id}
              openModal={openModal}
              tag={tags.find((t) => t.id === productTag.tagId)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const ProductTag = ({
  productTag,
  openModal,
  tag,
}: {
  productTag: CompleteProductTag;
  openModal: TOpenModal;
  tag: Tag | undefined;
}) => {
  const optimistic = productTag.id === 'optimistic';
  const deleting = productTag.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('product-tags')
    ? pathname
    : pathname + '/product-tags/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{tag?.name ?? productTag.tagId}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + productTag.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No product tags
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new product tag.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Product Tags{' '}
        </Button>
      </div>
    </div>
  );
};
