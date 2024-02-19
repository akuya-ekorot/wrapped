import { getProductPageDetailsByProductId } from '@/lib/api/products/queries';
import { TImage } from '@/lib/db/schema/images';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import CustomLink from './CustomLink';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import AddToCartButton from './AddToCartButton';
import { CartItem } from '@/lib/api/cart/mutations';
import { hasProductOptions } from './helpers';

export const revalidate = 60;

export default async function Page({
  params: { productId },
  searchParams,
}: {
  params: { productId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const product = await getProductPageDetailsByProductId(productId);

  if (!product) {
    return notFound();
  }

  const activeOptionValues = product.options.map((option) => ({
    option: product.options.find((o) => o.name === option.name)?.id,
    value: searchParams[option.name!],
  }));

  const variant = product.variants.find((variant) => {
    return variant.options.every((vo) =>
      activeOptionValues.some(
        (activeOptionValue) =>
          activeOptionValue.option === vo.optionId &&
          activeOptionValue.value === vo.optionValueId,
      ),
    );
  });

  const { activeImageId } = searchParams;

  const activeImage =
    product.images.find((image) =>
      Array.isArray(activeImageId)
        ? image.id === activeImageId[0]
        : image.id === activeImageId,
    ) ??
    variant?.images[0] ??
    product.images[0];

  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  });

  const hasOptions = hasProductOptions(product.options);

  let cartItem: CartItem | undefined;

  if (!hasOptions) {
    cartItem = {
      quantity: 1,
      product: {
        ...product,
        image: product.images[0],
      },
    };
  } else if (!variant) {
    cartItem = undefined;
  } else {
    const { images, options, ...rest } = variant;
    cartItem = {
      quantity: 1,
      variant: {
        ...rest,
        //@ts-ignore
        options: product.options.map((option) => ({
          ...option,
          value: option.values.find(
            (o) => o.id === searchParams[option.name!],
          )!,
        })),
        image: variant.images[0] ?? product.images[0],
      },
    };
  }

  if (!hasOptions) {
    return (
      <main className="space-y-4 p-8">
        <div className="grid grid-cols-2 gap-12">
          <ImageGrid activeImage={activeImage} images={product.images} />
          <section className="divide-y px-8">
            <header className="space-y-2">
              <h1 className="text-3xl">{product.name}</h1>
              <h3 className="text-2xl text-primary font-semibold">
                {`${formatter.format(product.price)}`}
              </h3>
            </header>
            <div className="py-4">
              <AddToCartButton cartItem={cartItem} />
            </div>
            <div className="py-4 text-primary/90 text-sm space-y-2">
              <p>{product.description}</p>
              {variant?.description && <p>{variant.description}</p>}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-4 p-8">
      <div className="grid grid-cols-2 gap-12">
        <ImageGrid activeImage={activeImage} images={product.images} />
        <section className="divide-y px-8">
          <header className="space-y-2">
            <h1 className="text-3xl">{product.name}</h1>
            {variant?.name ? (
              <h2 className="text-2xl text-primary/80">{variant.name}</h2>
            ) : (
              <h2 className="text-lg text-destructive/80">
                Product with selected options unavailable
              </h2>
            )}
            <h3 className="text-2xl text-primary font-semibold">
              {variant?.price
                ? formatter.format(variant.price)
                : `${formatter.format(product.price)}`}
            </h3>
          </header>
          <div className="space-y-4 py-4">
            {product.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <h3 className="text-sm">{option.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <CustomLink
                      key={value.id}
                      name={option.name!}
                      value={value.id}
                    >
                      <Button
                        variant={
                          searchParams[option.name!] === value.id
                            ? 'default'
                            : 'outline'
                        }
                        size={'sm'}
                      >
                        {value.name}
                      </Button>
                    </CustomLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="py-4">
            <AddToCartButton cartItem={cartItem} />
          </div>
          <div className="py-4 text-primary/90 text-sm space-y-2">
            <p>{product.description}</p>
            {variant?.description && <p>{variant.description}</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

function ImageGrid({
  images,
  activeImage,
}: {
  images: TImage[];
  activeImage?: TImage;
}) {
  return (
    <section className="grid grid-cols-10 gap-4">
      <ScrollArea className="col-span-2 h-[600px]">
        <div className="flex flex-col h-[600px] gap-2">
          {images.map((image) => (
            <CustomLink key={image.id} name="activeImageId" value={image.id}>
              <Image
                className="object-contain"
                key={image.id}
                src={image.url}
                alt=""
                height={400}
                width={400}
              />
            </CustomLink>
          ))}
        </div>
      </ScrollArea>
      <div className="col-span-8">
        {activeImage && (
          <Image
            className="object-contain object-top w-[600px] h-[600px]"
            src={activeImage.url}
            alt=""
            height={600}
            width={600}
          />
        )}
      </div>
    </section>
  );
}
