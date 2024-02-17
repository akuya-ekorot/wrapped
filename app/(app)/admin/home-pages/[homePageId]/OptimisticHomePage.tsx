'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/home-pages/useOptimisticHomePages';
import { type HomePage } from '@/lib/db/schema/homePages';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import HomePageForm from '@/components/homePages/HomePageForm';

export default function OptimisticHomePage({
  homePage,
}: {
  homePage: HomePage;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: HomePage) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticHomePage, setOptimisticHomePage] = useOptimistic(homePage);
  const updateHomePage: TAddOptimistic = (input) =>
    setOptimisticHomePage({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <HomePageForm
          homePage={homePage}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateHomePage}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{homePage.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticHomePage.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticHomePage, null, 2)}
      </pre>
    </div>
  );
}
