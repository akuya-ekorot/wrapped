'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type ReferredProduct,
  CompleteReferredProduct,
} from '@/lib/db/schema/referredProducts';
import Modal from '@/components/shared/Modal';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import {
  type FeaturedProductsSection,
  type FeaturedProductsSectionId,
} from '@/lib/db/schema/featuredProductsSection';
import { useOptimisticReferredProducts } from '@/app/(app)/admin/referred-products/useOptimisticReferredProducts';
import { Button } from '@/components/ui/button';
import ReferredProductForm from './ReferredProductForm';
import { PlusIcon } from 'lucide-react';
import { deleteReferredProductAction } from '@/lib/actions/referredProducts';

type TOpenModal = (referredProduct?: ReferredProduct) => void;

export default function ReferredProductList({
  referredProducts,
  products,
  productId,
  featuredProductsSection,
  featuredProductsSectionId,
}: {
  referredProducts: CompleteReferredProduct[];
  products: Product[];
  productId?: ProductId;
  featuredProductsSection: FeaturedProductsSection[];
  featuredProductsSectionId?: FeaturedProductsSectionId;
}) {
  const { optimisticReferredProducts, addOptimisticReferredProduct } =
    useOptimisticReferredProducts(
      referredProducts,
      products,
      featuredProductsSection,
    );
  const [open, setOpen] = useState(false);
  const [activeReferredProduct, setActiveReferredProduct] =
    useState<ReferredProduct | null>(null);
  const openModal = (referredProduct?: ReferredProduct) => {
    setOpen(true);
    referredProduct
      ? setActiveReferredProduct(referredProduct)
      : setActiveReferredProduct(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeReferredProduct
            ? 'Edit ReferredProduct'
            : 'Create Referred Product'
        }
      >
        <ReferredProductForm
          referredProduct={activeReferredProduct}
          addOptimistic={addOptimisticReferredProduct}
          openModal={openModal}
          closeModal={closeModal}
          products={products}
          productId={productId}
          featuredProductsSection={featuredProductsSection}
          featuredProductsSectionId={featuredProductsSectionId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticReferredProducts.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticReferredProducts.map((referredProduct) => (
            <ReferredProduct
              referredProduct={referredProduct}
              key={referredProduct.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const ReferredProduct = ({
  referredProduct,
  openModal,
}: {
  referredProduct: CompleteReferredProduct;
  openModal: TOpenModal;
}) => {
  const optimistic = referredProduct.id === 'optimistic';
  const deleting = referredProduct.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('referred-products')
    ? pathname
    : pathname + '/referred-products/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{referredProduct.product?.name}</div>
      </div>
      <Button
        onClick={() => deleteReferredProductAction(referredProduct.id)}
        variant={'link'}
      >
        Detach Product
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No referred products
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new referred product.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Referred Products{' '}
        </Button>
      </div>
    </div>
  );
};
