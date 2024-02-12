import { Button } from '@/components/ui/button';
import { Menu, Search, ShoppingCart, UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <StorefrontNavBar />
      <HomeHero />
      <MainCategories />
      <FeaturedCollection />
      <FeaturedProducts />
    </main>
  );
}

function FeaturedProductItem() {
  return (
    <div className="w-44 space-y-3">
      <Link
        className="hover:underline space-y-1"
        href={'/products/some-product'}
      >
        <Image src={'/wrapped-sample.png'} alt="" height={224} width={192} />
        <h3 className="uppercase text-sm">Some product</h3>
        <p className="uppercase text-xs font-semibold">Ksh 2000</p>
      </Link>
      <Button className="w-full" variant={'outline'}>
        Add to cart
      </Button>
    </div>
  );
}

function FeaturedProducts() {
  return (
    <section className="px-12 py-9 flex flex-col items-center gap-4">
      <h2 className="uppercase">Featured products</h2>
      <div className="w-full flex items-center justify-center flex-wrap gap-2">
        <FeaturedProductItem />
        <FeaturedProductItem />
        <FeaturedProductItem />
        <FeaturedProductItem />
        <FeaturedProductItem />
        <FeaturedProductItem />
      </div>
    </section>
  );
}

function FeaturedCollection() {
  return (
    <section className="relative h-[512px]">
      <Image
        className="w-full h-full object-cover"
        src={'/home-hero.jpg'}
        alt=""
        width={1024}
        height={512}
      />
      <Link
        href={`collections/${'some-collection'}`}
        className="absolute top-0 left-0 text-primary-foreground w-full h-full bg-black/40 flex flex-col justify-end p-8"
      >
        <h1 className="uppercase font-semibold text-5xl">New Arrivals</h1>
        <p className="uppercase text-3xl">shop now</p>
      </Link>
    </section>
  );
}

function MainCategoryItem() {
  return (
    <div className="h-60 w-44 space-y-2 text-center hover:underline">
      <Link href={'/collections/some-collection'}>
        <Image src={'/wrapped-sample.png'} alt="" height={224} width={192} />
        <h3 className="uppercase text-sm">Some collection</h3>
      </Link>
    </div>
  );
}

function MainCategories() {
  return (
    <section className="px-12 py-9 flex flex-col items-center gap-4">
      <h2 className="uppercase">What are you looking for?</h2>
      <div className="w-full flex items-center justify-center flex-wrap gap-2">
        <MainCategoryItem />
        <MainCategoryItem />
        <MainCategoryItem />
        <MainCategoryItem />
        <MainCategoryItem />
        <MainCategoryItem />
      </div>
    </section>
  );
}

function HomeHero() {
  return (
    <section className="relative h-[512px]">
      <Image
        className="w-full h-full object-cover"
        src={'/home-hero.jpg'}
        alt=""
        width={1024}
        height={512}
      />
      <Link
        href={`collections/${'some-collection'}`}
        className="absolute top-0 left-0 text-primary-foreground w-full h-full bg-black/40 flex flex-col justify-end p-8"
      >
        <h1 className="uppercase font-semibold text-5xl">New Arrivals</h1>
        <p className="uppercase text-3xl">shop now</p>
      </Link>
    </section>
  );
}

function StorefrontNavBar() {
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

function NavBarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="h-12 w-12 flex items-center justify-center" href={href}>
      {children}
    </Link>
  );
}
