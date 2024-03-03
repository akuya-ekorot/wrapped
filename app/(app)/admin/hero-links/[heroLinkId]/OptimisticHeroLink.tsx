'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/hero-links/useOptimisticHeroLinks';
import { type HeroLink } from '@/lib/db/schema/heroLinks';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import HeroLinkForm from '@/components/heroLinks/HeroLinkForm';
import {
  type HeroSection,
  type HeroSectionId,
} from '@/lib/db/schema/heroSections';

export default function OptimisticHeroLink({
  heroLink,
  heroSections,
  heroSectionId,
}: {
  heroLink: HeroLink;

  heroSections: HeroSection[];
  heroSectionId?: HeroSectionId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: HeroLink) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticHeroLink, setOptimisticHeroLink] = useOptimistic(heroLink);
  const updateHeroLink: TAddOptimistic = (input) =>
    setOptimisticHeroLink({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <HeroLinkForm
          heroLink={heroLink}
          heroSections={heroSections}
          heroSectionId={heroSectionId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateHeroLink}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{heroLink.type}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
    </div>
  );
}
