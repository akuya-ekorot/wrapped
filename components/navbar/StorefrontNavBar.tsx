import Link from 'next/link';
import CartLink from '../cart/CartLink';

export function StorefrontNavBar() {
  return (
    <nav className="z-10 bg-background flex items-center justify-center sticky top-0 border-b">
      <div className="relative w-full max-w-6xl flex items-center justify-end h-16">
        <Link
          className="hover:underline absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2"
          href={'/'}
        >
          <span className="uppercase font-semibold text-xl text-primary">
            wrapped nation
          </span>
        </Link>
        <div className="flex items-stretch gap-4">
          <CartLink />
        </div>
      </div>
    </nav>
  );
}
