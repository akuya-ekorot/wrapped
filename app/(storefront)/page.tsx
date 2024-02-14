import { Button } from '@/components/ui/button';
import { getHomePages } from '@/lib/api/homePages/queries';
import { Menu, Search, ShoppingCart, UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { getCollectionImagesByCollectionId } from '@/lib/api/collectionImages/queries';
import { getHeroCollections } from '@/lib/api/heroCollections/queries';
import { getHeroLinks } from '@/lib/api/heroLinks/queries';
import { getHeroProducts } from '@/lib/api/heroProducts/queries';
import { getHeroSections } from '@/lib/api/heroSections/queries';
import { getMainCollections } from '@/lib/api/mainCollections/queries';
import { getReferredCollections } from '@/lib/api/referredCollections/queries';
import { CompleteReferredCollection } from '@/lib/db/schema/referredCollections';
import type { Metadata } from 'next';
import { getFeaturedCollectionSections } from '@/lib/api/featuredCollectionSections/queries';
import {
  getFeaturedProductsSectionByIdWithReferredProducts,
  getFeaturedProductsSections,
} from '@/lib/api/featuredProductsSection/queries';
import { CompleteReferredProduct } from '@/lib/db/schema/referredProducts';
import { getProductByIdWithProductImagesAndOptionsAndProductTags } from '@/lib/api/products/queries';

export async function generateMetadata(): Promise<Metadata> {
  const { homePages } = await getHomePages();
  const homePage = homePages[0];

  return {
    title: homePage.title,
    description: homePage.description,
  };
}

export default function Page() {
  return (
    <main>
      <StorefrontNavBar />
      <HomeHero />
      <MainCollections />
      <FeaturedCollection />
      <FeaturedProducts />
    </main>
  );
}

async function FeaturedProductItem({
  referredProduct,
}: {
  referredProduct: CompleteReferredProduct;
}) {
  // TODO: if product.price doesn't exist, look for the lowest variant price
  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(referredProduct.product?.price ?? 0);

  const { images } =
    await getProductByIdWithProductImagesAndOptionsAndProductTags(
      referredProduct.productId,
    );

  const image = images?.find((pi) => pi.url !== undefined);

  return (
    <div className="w-44 space-y-3">
      <Link
        className="hover:underline space-y-1"
        href={`/products/${referredProduct.productId}`}
      >
        {image?.url ? (
          <Image
            className="w-44 h-56 bg-muted border object-cover"
            src={image.url}
            alt=""
            height={224}
            width={192}
          />
        ) : (
          <div className="w-44 h-56 bg-muted border"></div>
        )}
        <h3 className="uppercase text-sm">
          {referredProduct.product?.name ?? ''}
        </h3>
        <p className="uppercase text-xs font-semibold">{formattedPrice}</p>
      </Link>
      <Button className="w-full" variant={'outline'}>
        Add to cart
      </Button>
    </div>
  );
}

async function FeaturedProducts() {
  const { featuredProductsSection } = await getFeaturedProductsSections();
  const { referredProducts } =
    await getFeaturedProductsSectionByIdWithReferredProducts(
      featuredProductsSection[0].id,
    );

  return (
    <section className="px-12 py-9 flex flex-col items-center gap-4">
      <h2 className="uppercase">{featuredProductsSection[0].title}</h2>
      <div className="w-full flex items-center justify-center flex-wrap gap-2">
        {referredProducts?.map((rp) => (
          <FeaturedProductItem key={rp.id} referredProduct={rp} />
        ))}
      </div>
    </section>
  );
}

async function FeaturedCollection() {
  const { featuredCollectionSections } = await getFeaturedCollectionSections();

  const featuredCollectionSection = featuredCollectionSections[0];

  return (
    <section className="relative h-[512px]">
      <Image
        className="w-full h-full object-cover"
        src={featuredCollectionSection.image?.url ?? ''}
        alt=""
        width={1024}
        height={512}
      />
      <Link
        href={`collections/${featuredCollectionSection.collectionId}`}
        className="absolute top-0 left-0 text-primary-foreground w-full h-full bg-black/40 flex flex-col justify-end p-8"
      >
        <h1 className="uppercase font-semibold text-5xl">
          {featuredCollectionSection.title}
        </h1>
        <p className="uppercase text-3xl">
          {featuredCollectionSection.callToAction ?? ''}
        </p>
      </Link>
    </section>
  );
}

async function MainCategoryItem({
  referredCollection,
}: {
  referredCollection: CompleteReferredCollection;
}) {
  const { collectionImages } = await getCollectionImagesByCollectionId(
    referredCollection.collectionId,
  );

  return (
    <div className="w-44 space-y-2 text-center hover:underline">
      <Link
        className="space-y-2 h-full"
        href={`/collections/${referredCollection.collection?.id}`}
      >
        {collectionImages && collectionImages.length > 0 ? (
          <Image
            className="w-44 h-56 object-cover border"
            src={collectionImages[0].image?.url ?? ''}
            alt=""
            height={224}
            width={192}
          />
        ) : (
          <div className="w-44 h-56 bg-muted border"></div>
        )}
        <h3 className="uppercase text-sm">
          {referredCollection.collection?.name}
        </h3>
      </Link>
    </div>
  );
}

async function MainCollections() {
  const { mainCollections } = await getMainCollections();
  const mainCollection = mainCollections[0];

  const { referredCollections } = await getReferredCollections();

  return (
    <section className="px-12 py-9 flex flex-col items-center gap-4">
      <h2 className="uppercase">{mainCollection.title}</h2>
      <div className="w-full flex items-center justify-center flex-wrap gap-2">
        {referredCollections
          ?.filter((rc) => rc.mainCollectionId === mainCollection.id)
          .map((rc) => (
            <MainCategoryItem key={rc.id} referredCollection={rc} />
          ))}
      </div>
    </section>
  );
}

async function HomeHero() {
  const { heroSections } = await getHeroSections();
  const heroSection = heroSections[0];
  const { heroLinks } = await getHeroLinks();

  const heroLink = heroLinks.find(
    (link) => link.heroSectionId === heroSection.id,
  );

  let link: string | undefined;

  if (heroLink) {
    if (heroLink.type === 'collection') {
      const { heroCollections } = await getHeroCollections();
      const heroCollection = heroCollections.find(
        (collection) => collection.heroLinkId === heroLink.id,
      );

      if (heroCollection?.collection?.id) {
        link = `/collections/${heroCollection.collection?.id}`;
      }
    }

    if (heroLink.type === 'product') {
      const { heroProducts } = await getHeroProducts();
      const heroProduct = heroProducts.find(
        (hp) => hp.heroLinkId === heroLink.id,
      );

      if (heroProduct?.product?.id) {
        link = `/products/${heroProduct.product?.id}`;
      }
    }
  }

  return (
    <section className="relative h-[512px]">
      <Image
        className="w-full h-full object-cover"
        src={heroSection.image?.url ?? ''}
        alt=""
        width={1024}
        height={512}
      />

      {link ? (
        <Link
          href={link}
          className="absolute top-0 left-0 text-primary-foreground w-full h-full bg-black/40 flex flex-col justify-end p-8"
        >
          <h1 className="uppercase font-semibold text-5xl">
            {heroSection.title}
          </h1>
          <p className="uppercase text-3xl">{heroSection.callToAction ?? ''}</p>
        </Link>
      ) : (
        <div className="absolute top-0 left-0 text-primary-foreground w-full h-full bg-black/40 flex flex-col justify-end p-8">
          <h1 className="uppercase font-semibold text-5xl">
            {heroSection.title}
          </h1>
          <p className="uppercase text-3xl">{heroSection.callToAction ?? ''}</p>
        </div>
      )}
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
