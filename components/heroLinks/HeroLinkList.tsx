'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { type HeroLink, CompleteHeroLink } from '@/lib/db/schema/heroLinks';
import Modal from '@/components/shared/Modal';
import {
  type HeroSection,
  type HeroSectionId,
} from '@/lib/db/schema/heroSections';
import { useOptimisticHeroLinks } from '@/app/(app)/admin/hero-links/useOptimisticHeroLinks';
import { Button } from '@/components/ui/button';
import HeroLinkForm from './HeroLinkForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (heroLink?: HeroLink) => void;

export default function HeroLinkList({
  heroLinks,
  heroSections,
  heroSectionId,
}: {
  heroLinks: CompleteHeroLink[];
  heroSections: HeroSection[];
  heroSectionId?: HeroSectionId;
}) {
  const { optimisticHeroLinks, addOptimisticHeroLink } = useOptimisticHeroLinks(
    heroLinks,
    heroSections,
  );
  const [open, setOpen] = useState(false);
  const [activeHeroLink, setActiveHeroLink] = useState<HeroLink | null>(null);
  const openModal = (heroLink?: HeroLink) => {
    setOpen(true);
    heroLink ? setActiveHeroLink(heroLink) : setActiveHeroLink(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeHeroLink ? 'Edit HeroLink' : 'Create Hero Link'}
      >
        <HeroLinkForm
          heroLink={activeHeroLink}
          addOptimistic={addOptimisticHeroLink}
          openModal={openModal}
          closeModal={closeModal}
          heroSections={heroSections}
          heroSectionId={heroSectionId}
        />
      </Modal>
      {optimisticHeroLinks.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticHeroLinks.map((heroLink) => (
            <HeroLink
              heroLink={heroLink}
              key={heroLink.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const HeroLink = ({
  heroLink,
  openModal,
}: {
  heroLink: CompleteHeroLink;
  openModal: TOpenModal;
}) => {
  const optimistic = heroLink.id === 'optimistic';
  const deleting = heroLink.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('hero-links')
    ? pathname
    : pathname + '/hero-links/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>Link to {heroLink.type}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + heroLink.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No hero links
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new hero link.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Hero Links{' '}
        </Button>
      </div>
    </div>
  );
};
