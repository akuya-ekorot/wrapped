import { TImage } from '@/lib/db/schema/images';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

export default function ImageSelect({
  images,
  selected,
  setSelected,
}: {
  images: TImage[];
  selected: TImage | undefined;
  setSelected: (image: TImage) => void;
}) {
  return (
    <div className="p-2 flex flex-wrap gap-2">
      {images.length === 0 ? (
        <div className="h-12 text-center w-full">
          No Product Images to select
        </div>
      ) : (
        <div className="px-5">
          <Carousel className="">
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id} className="basis-1/2">
                  <Image
                    onClick={() => setSelected(image)}
                    className={cn(
                      'rounded-md w-full m-2',
                      image.id === selected?.id ? 'ring' : '',
                    )}
                    src={image.url}
                    alt=""
                    width={200}
                    height={200}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext type="button" />
            <CarouselPrevious type="button" />
          </Carousel>
        </div>
      )}
    </div>
  );
}
