'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { type HomePage, CompleteHomePage } from '@/lib/db/schema/homePages';
import Modal from '@/components/shared/Modal';

import { useOptimisticHomePages } from '@/app/(app)/admin/home-page/useOptimisticHomePages';
import { Button } from '@/components/ui/button';
import HomePageForm from './HomePageForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (homePage?: HomePage) => void;

export default function HomePageList({
  homePages,
}: {
  homePages: CompleteHomePage[];
}) {
  const { optimisticHomePages, addOptimisticHomePage } =
    useOptimisticHomePages(homePages);
  const [open, setOpen] = useState(false);
  const [activeHomePage, setActiveHomePage] = useState<HomePage | null>(null);
  const openModal = (homePage?: HomePage) => {
    setOpen(true);
    homePage ? setActiveHomePage(homePage) : setActiveHomePage(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeHomePage ? 'Edit HomePage' : 'Create Home Page'}
      >
        <HomePageForm
          homePage={activeHomePage}
          addOptimistic={addOptimisticHomePage}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticHomePages.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticHomePages.map((homePage) => (
            <HomePage
              homePage={homePage}
              key={homePage.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const HomePage = ({
  homePage,
  openModal,
}: {
  homePage: CompleteHomePage;
  openModal: TOpenModal;
}) => {
  const optimistic = homePage.id === 'optimistic';
  const deleting = homePage.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('home-pages')
    ? pathname
    : pathname + '/home-pages/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{homePage.title}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + homePage.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No home pages
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new home page.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Home Pages{' '}
        </Button>
      </div>
    </div>
  );
};
