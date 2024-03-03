'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/featured-collection-sections/useOptimisticFeaturedCollectionSections';
import {
  CompleteFeaturedCollectionSection,
  type FeaturedCollectionSection,
} from '@/lib/db/schema/featuredCollectionSections';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import FeaturedCollectionSectionForm from '@/components/featuredCollectionSections/FeaturedCollectionSectionForm';
import { type TImage, type ImageId } from '@/lib/db/schema/images';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';
import FeaturedCollectionSectionInfoList from '@/components/featuredCollectionSections/FeaturedCollectionsSectionInfoList';

export default function OptimisticFeaturedCollectionSection({
  featuredCollectionSection,
  images,
  imageId,
  collections,
  collectionId,
  homePages,
  homePageId,
}: {
  featuredCollectionSection: FeaturedCollectionSection;

  images: TImage[];
  imageId?: ImageId;
  collections: Collection[];
  collectionId?: CollectionId;
  homePages: HomePage[];
  homePageId?: HomePageId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: FeaturedCollectionSection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [
    optimisticFeaturedCollectionSection,
    setOptimisticFeaturedCollectionSection,
  ] = useOptimistic(featuredCollectionSection);
  const updateFeaturedCollectionSection: TAddOptimistic = (input) =>
    setOptimisticFeaturedCollectionSection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <FeaturedCollectionSectionForm
          featuredCollectionSection={featuredCollectionSection}
          images={images}
          imageId={imageId}
          collections={collections}
          collectionId={collectionId}
          homePages={homePages}
          homePageId={homePageId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateFeaturedCollectionSection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {featuredCollectionSection.title}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <FeaturedCollectionSectionInfoList
        featuredCollectionSection={
          optimisticFeaturedCollectionSection as CompleteFeaturedCollectionSection
        }
      />
    </div>
  );
}
