'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type HeroSection,
  CompleteHeroSection,
} from '@/lib/db/schema/heroSections';
import Modal from '@/components/shared/Modal';
import { type TImage, type ImageId } from '@/lib/db/schema/images';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';
import { useOptimisticHeroSections } from '@/app/(app)/admin/hero-sections/useOptimisticHeroSections';
import { Button } from '@/components/ui/button';
import HeroSectionForm from './HeroSectionForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (heroSection?: HeroSection) => void;

export default function HeroSectionList({
  heroSections,
  images,
  imageId,
  homePages,
  homePageId,
}: {
  heroSections: CompleteHeroSection[];
  images: TImage[];
  imageId?: ImageId;
  homePages: HomePage[];
  homePageId?: HomePageId;
}) {
  const { optimisticHeroSections, addOptimisticHeroSection } =
    useOptimisticHeroSections(heroSections, images, homePages);
  const [open, setOpen] = useState(false);
  const [activeHeroSection, setActiveHeroSection] =
    useState<HeroSection | null>(null);
  const openModal = (heroSection?: HeroSection) => {
    setOpen(true);
    heroSection
      ? setActiveHeroSection(heroSection)
      : setActiveHeroSection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeHeroSection ? 'Edit HeroSection' : 'Create Hero Section'}
      >
        <HeroSectionForm
          heroSection={activeHeroSection}
          addOptimistic={addOptimisticHeroSection}
          openModal={openModal}
          closeModal={closeModal}
          images={images}
          imageId={imageId}
          homePages={homePages}
          homePageId={homePageId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticHeroSections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticHeroSections.map((heroSection) => (
            <HeroSection
              heroSection={heroSection}
              key={heroSection.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const HeroSection = ({
  heroSection,
  openModal,
}: {
  heroSection: CompleteHeroSection;
  openModal: TOpenModal;
}) => {
  const optimistic = heroSection.id === 'optimistic';
  const deleting = heroSection.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('hero-sections')
    ? pathname
    : pathname + '/hero-sections/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{heroSection.title}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + heroSection.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No hero sections
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new hero section.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Hero Sections{' '}
        </Button>
      </div>
    </div>
  );
};
