'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type FeaturedProductsSection,
  CompleteFeaturedProductsSection,
} from '@/lib/db/schema/featuredProductsSection';
import Modal from '@/components/shared/Modal';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';
import { useOptimisticFeaturedProductsSections } from '@/app/(app)/admin/featured-products-section/useOptimisticFeaturedProductsSection';
import { Button } from '@/components/ui/button';
import FeaturedProductsSectionForm from './FeaturedProductsSectionForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (featuredProductsSection?: FeaturedProductsSection) => void;

export default function FeaturedProductsSectionList({
  featuredProductsSection,
  homePages,
  homePageId,
}: {
  featuredProductsSection: CompleteFeaturedProductsSection[];
  homePages: HomePage[];
  homePageId?: HomePageId;
}) {
  const {
    optimisticFeaturedProductsSections,
    addOptimisticFeaturedProductsSection,
  } = useOptimisticFeaturedProductsSections(featuredProductsSection, homePages);
  const [open, setOpen] = useState(false);
  const [activeFeaturedProductsSection, setActiveFeaturedProductsSection] =
    useState<FeaturedProductsSection | null>(null);
  const openModal = (featuredProductsSection?: FeaturedProductsSection) => {
    setOpen(true);
    featuredProductsSection
      ? setActiveFeaturedProductsSection(featuredProductsSection)
      : setActiveFeaturedProductsSection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeFeaturedProductsSection
            ? 'Edit FeaturedProductsSection'
            : 'Create Featured Products Section'
        }
      >
        <FeaturedProductsSectionForm
          featuredProductsSection={activeFeaturedProductsSection}
          addOptimistic={addOptimisticFeaturedProductsSection}
          openModal={openModal}
          closeModal={closeModal}
          homePages={homePages}
          homePageId={homePageId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticFeaturedProductsSections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticFeaturedProductsSections.map((featuredProductsSection) => (
            <FeaturedProductsSection
              featuredProductsSection={featuredProductsSection}
              key={featuredProductsSection.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const FeaturedProductsSection = ({
  featuredProductsSection,
  openModal,
}: {
  featuredProductsSection: CompleteFeaturedProductsSection;
  openModal: TOpenModal;
}) => {
  const optimistic = featuredProductsSection.id === 'optimistic';
  const deleting = featuredProductsSection.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('featured-products-section')
    ? pathname
    : pathname + '/featured-products-section/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{featuredProductsSection.title}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + featuredProductsSection.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No featured products section
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new featured products section.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Featured Products Section{' '}
        </Button>
      </div>
    </div>
  );
};
