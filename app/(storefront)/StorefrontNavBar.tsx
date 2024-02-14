import { Button } from '@/components/ui/button';
import { Menu, Search, ShoppingCart, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { NavBarLink } from './NavBarLink';

export function StorefrontNavBar() {
  return (
    <nav className="z-10 bg-background flex items-center justify-center sticky top-0 border-b">
      <div className="relative w-full max-w-6xl flex items-center justify-between">
        <Button variant={'link'}>
          <Menu />
        </Button>
        <Link
          className="hover:underline absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2"
          href={'/'}
        >
          <span className="uppercase font-semibold">wrapped nation</span>
        </Link>
        <div className="flex items-stretch gap-4">
          <NavBarLink href="/search">
            <Search />
          </NavBarLink>
          <NavBarLink href="/cart">
            <ShoppingCart />
          </NavBarLink>
          <NavBarLink href="/account">
            <UserCircle />
          </NavBarLink>
        </div>
      </div>
    </nav>
  );
}
