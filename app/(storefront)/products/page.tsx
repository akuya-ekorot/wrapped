import { notFound } from 'next/navigation';

export const revalidate = 60;

export default function Page() {
  notFound();
}
