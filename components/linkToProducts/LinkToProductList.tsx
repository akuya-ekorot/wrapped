'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type LinkToProduct,
  CompleteLinkToProduct,
} from '@/lib/db/schema/linkToProducts';
import Modal from '@/components/shared/Modal';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import { type PageLink, type PageLinkId } from '@/lib/db/schema/pageLinks';
import { useOptimisticLinkToProducts } from '@/app/(app)/admin/link-to-products/useOptimisticLinkToProducts';
import { Button } from '@/components/ui/button';
import LinkToProductForm from './LinkToProductForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (linkToProduct?: LinkToProduct) => void;

export default function LinkToProductList({
  linkToProducts,
  products,
  productId,
  pageLinks,
  pageLinkId,
}: {
  linkToProducts: CompleteLinkToProduct[];
  products: Product[];
  productId?: ProductId;
  pageLinks: PageLink[];
  pageLinkId?: PageLinkId;
}) {
  const { optimisticLinkToProducts, addOptimisticLinkToProduct } =
    useOptimisticLinkToProducts(linkToProducts, products, pageLinks);
  const [open, setOpen] = useState(false);
  const [activeLinkToProduct, setActiveLinkToProduct] =
    useState<LinkToProduct | null>(null);
  const openModal = (linkToProduct?: LinkToProduct) => {
    setOpen(true);
    linkToProduct
      ? setActiveLinkToProduct(linkToProduct)
      : setActiveLinkToProduct(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeLinkToProduct ? 'Edit LinkToProduct' : 'Create Link To Product'
        }
      >
        <LinkToProductForm
          linkToProduct={activeLinkToProduct}
          addOptimistic={addOptimisticLinkToProduct}
          openModal={openModal}
          closeModal={closeModal}
          products={products}
          productId={productId}
          pageLinks={pageLinks}
          pageLinkId={pageLinkId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticLinkToProducts.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticLinkToProducts.map((linkToProduct) => (
            <LinkToProduct
              linkToProduct={linkToProduct}
              key={linkToProduct.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const LinkToProduct = ({
  linkToProduct,
  openModal,
}: {
  linkToProduct: CompleteLinkToProduct;
  openModal: TOpenModal;
}) => {
  const optimistic = linkToProduct.id === 'optimistic';
  const deleting = linkToProduct.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('link-to-products')
    ? pathname
    : pathname + '/link-to-products/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{linkToProduct.product?.name}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + linkToProduct.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No link to products
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new link to product.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Link To Products{' '}
        </Button>
      </div>
    </div>
  );
};
