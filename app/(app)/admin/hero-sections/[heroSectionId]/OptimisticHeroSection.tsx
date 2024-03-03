'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/hero-sections/useOptimisticHeroSections';
import { type HeroSection } from '@/lib/db/schema/heroSections';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import HeroSectionForm from '@/components/heroSections/HeroSectionForm';
import { type TImage, type ImageId } from '@/lib/db/schema/images';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';
import HeroSectionInfoList from '@/components/heroSections/HeroSectionInfoList';

export default function OptimisticHeroSection({
  heroSection,
  images,
  imageId,
  homePages,
  homePageId,
}: {
  heroSection: HeroSection;
  images: TImage[];
  imageId?: ImageId;
  homePages: HomePage[];
  homePageId?: HomePageId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: HeroSection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticHeroSection, setOptimisticHeroSection] =
    useOptimistic(heroSection);
  const updateHeroSection: TAddOptimistic = (input) =>
    setOptimisticHeroSection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <HeroSectionForm
          heroSection={heroSection}
          images={images}
          imageId={imageId}
          homePages={homePages}
          homePageId={homePageId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateHeroSection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{heroSection.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <HeroSectionInfoList heroSection={optimisticHeroSection} />
    </div>
  );
}
