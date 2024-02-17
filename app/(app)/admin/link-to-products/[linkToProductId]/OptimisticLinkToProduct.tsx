'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/link-to-products/useOptimisticLinkToProducts';
import { type LinkToProduct } from '@/lib/db/schema/linkToProducts';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import LinkToProductForm from '@/components/linkToProducts/LinkToProductForm';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import { type PageLink, type PageLinkId } from '@/lib/db/schema/pageLinks';

export default function OptimisticLinkToProduct({
  linkToProduct,
  products,
  productId,
  pageLinks,
  pageLinkId,
}: {
  linkToProduct: LinkToProduct;

  products: Product[];
  productId?: ProductId;
  pageLinks: PageLink[];
  pageLinkId?: PageLinkId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: LinkToProduct) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticLinkToProduct, setOptimisticLinkToProduct] =
    useOptimistic(linkToProduct);
  const updateLinkToProduct: TAddOptimistic = (input) =>
    setOptimisticLinkToProduct({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <LinkToProductForm
          linkToProduct={linkToProduct}
          products={products}
          productId={productId}
          pageLinks={pageLinks}
          pageLinkId={pageLinkId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateLinkToProduct}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{linkToProduct.productId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticLinkToProduct.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticLinkToProduct, null, 2)}
      </pre>
    </div>
  );
}
