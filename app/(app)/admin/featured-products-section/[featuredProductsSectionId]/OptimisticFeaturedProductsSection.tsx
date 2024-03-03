'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/featured-products-section/useOptimisticFeaturedProductsSection';
import { type FeaturedProductsSection } from '@/lib/db/schema/featuredProductsSection';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import FeaturedProductsSectionForm from '@/components/featuredProductsSection/FeaturedProductsSectionForm';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';

export default function OptimisticFeaturedProductsSection({
  featuredProductsSection,
  homePages,
  homePageId,
}: {
  featuredProductsSection: FeaturedProductsSection;

  homePages: HomePage[];
  homePageId?: HomePageId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: FeaturedProductsSection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [
    optimisticFeaturedProductsSection,
    setOptimisticFeaturedProductsSection,
  ] = useOptimistic(featuredProductsSection);
  const updateFeaturedProductsSection: TAddOptimistic = (input) =>
    setOptimisticFeaturedProductsSection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <FeaturedProductsSectionForm
          featuredProductsSection={featuredProductsSection}
          homePages={homePages}
          homePageId={homePageId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateFeaturedProductsSection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {featuredProductsSection.title}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
    </div>
  );
}
