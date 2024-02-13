'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type HeroProduct,
  CompleteHeroProduct,
} from '@/lib/db/schema/heroProducts';
import Modal from '@/components/shared/Modal';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import { type HeroLink, type HeroLinkId } from '@/lib/db/schema/heroLinks';
import { useOptimisticHeroProducts } from '@/app/(app)/admin/hero-products/useOptimisticHeroProducts';
import { Button } from '@/components/ui/button';
import HeroProductForm from './HeroProductForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (heroProduct?: HeroProduct) => void;

export default function HeroProductList({
  heroProducts,
  products,
  productId,
  heroLinks,
  heroLinkId,
}: {
  heroProducts: CompleteHeroProduct[];
  products: Product[];
  productId?: ProductId;
  heroLinks: HeroLink[];
  heroLinkId?: HeroLinkId;
}) {
  const { optimisticHeroProducts, addOptimisticHeroProduct } =
    useOptimisticHeroProducts(heroProducts, products, heroLinks);
  const [open, setOpen] = useState(false);
  const [activeHeroProduct, setActiveHeroProduct] =
    useState<HeroProduct | null>(null);
  const openModal = (heroProduct?: HeroProduct) => {
    setOpen(true);
    heroProduct
      ? setActiveHeroProduct(heroProduct)
      : setActiveHeroProduct(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeHeroProduct ? 'Edit HeroProduct' : 'Create Hero Product'}
      >
        <HeroProductForm
          heroProduct={activeHeroProduct}
          addOptimistic={addOptimisticHeroProduct}
          openModal={openModal}
          closeModal={closeModal}
          products={products}
          productId={productId}
          heroLinks={heroLinks}
          heroLinkId={heroLinkId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticHeroProducts.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticHeroProducts.map((heroProduct) => (
            <HeroProduct
              heroProduct={heroProduct}
              key={heroProduct.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const HeroProduct = ({
  heroProduct,
  openModal,
}: {
  heroProduct: CompleteHeroProduct;
  openModal: TOpenModal;
}) => {
  const optimistic = heroProduct.id === 'optimistic';
  const deleting = heroProduct.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('hero-products')
    ? pathname
    : pathname + '/hero-products/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{heroProduct.productId}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + heroProduct.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No hero products
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new hero product.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Hero Products{' '}
        </Button>
      </div>
    </div>
  );
};
