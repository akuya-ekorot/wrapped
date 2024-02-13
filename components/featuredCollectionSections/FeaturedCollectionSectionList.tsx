'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type FeaturedCollectionSection,
  CompleteFeaturedCollectionSection,
} from '@/lib/db/schema/featuredCollectionSections';
import Modal from '@/components/shared/Modal';
import { type TImage, type ImageId } from '@/lib/db/schema/images';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';
import { useOptimisticFeaturedCollectionSections } from '@/app/(app)/admin/featured-collection-sections/useOptimisticFeaturedCollectionSections';
import { Button } from '@/components/ui/button';
import FeaturedCollectionSectionForm from './FeaturedCollectionSectionForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (
  featuredCollectionSection?: FeaturedCollectionSection,
) => void;

export default function FeaturedCollectionSectionList({
  featuredCollectionSections,
  images,
  imageId,
  collections,
  collectionId,
  homePages,
  homePageId,
}: {
  featuredCollectionSections: CompleteFeaturedCollectionSection[];
  images: TImage[];
  imageId?: ImageId;
  collections: Collection[];
  collectionId?: CollectionId;
  homePages: HomePage[];
  homePageId?: HomePageId;
}) {
  const {
    optimisticFeaturedCollectionSections,
    addOptimisticFeaturedCollectionSection,
  } = useOptimisticFeaturedCollectionSections(
    featuredCollectionSections,
    images,
    collections,
    homePages,
  );
  const [open, setOpen] = useState(false);
  const [activeFeaturedCollectionSection, setActiveFeaturedCollectionSection] =
    useState<FeaturedCollectionSection | null>(null);
  const openModal = (featuredCollectionSection?: FeaturedCollectionSection) => {
    setOpen(true);
    featuredCollectionSection
      ? setActiveFeaturedCollectionSection(featuredCollectionSection)
      : setActiveFeaturedCollectionSection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeFeaturedCollectionSection
            ? 'Edit FeaturedCollectionSection'
            : 'Create Featured Collection Section'
        }
      >
        <FeaturedCollectionSectionForm
          featuredCollectionSection={activeFeaturedCollectionSection}
          addOptimistic={addOptimisticFeaturedCollectionSection}
          openModal={openModal}
          closeModal={closeModal}
          images={images}
          imageId={imageId}
          collections={collections}
          collectionId={collectionId}
          homePages={homePages}
          homePageId={homePageId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticFeaturedCollectionSections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticFeaturedCollectionSections.map(
            (featuredCollectionSection) => (
              <FeaturedCollectionSection
                featuredCollectionSection={featuredCollectionSection}
                key={featuredCollectionSection.id}
                openModal={openModal}
              />
            ),
          )}
        </ul>
      )}
    </div>
  );
}

const FeaturedCollectionSection = ({
  featuredCollectionSection,
  openModal,
}: {
  featuredCollectionSection: CompleteFeaturedCollectionSection;
  openModal: TOpenModal;
}) => {
  const optimistic = featuredCollectionSection.id === 'optimistic';
  const deleting = featuredCollectionSection.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('featured-collection-sections')
    ? pathname
    : pathname + '/featured-collection-sections/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{featuredCollectionSection.title}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + featuredCollectionSection.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No featured collection sections
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new featured collection section.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Featured Collection Sections{' '}
        </Button>
      </div>
    </div>
  );
};
