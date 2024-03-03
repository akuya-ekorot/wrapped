import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/featured-collection-sections/useOptimisticFeaturedCollectionSections';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBackPath } from '@/components/shared/BackButton';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  type FeaturedCollectionSection,
  insertFeaturedCollectionSectionParams,
} from '@/lib/db/schema/featuredCollectionSections';
import {
  createFeaturedCollectionSectionAction,
  deleteFeaturedCollectionSectionAction,
  updateFeaturedCollectionSectionAction,
} from '@/lib/actions/featuredCollectionSections';
import { type TImage, type ImageId } from '@/lib/db/schema/images';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';
import { useOptimisticImages } from '@/app/(app)/admin/images/useOptimisticImages';
import Image from 'next/image';
import Modal from '../shared/Modal';
import ImageForm from '../images/ImageForm';

const FeaturedCollectionSectionForm = ({
  images,
  imageId,
  collections,
  collectionId,
  homePages,
  homePageId,
  featuredCollectionSection,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  featuredCollectionSection?: FeaturedCollectionSection | null;
  images: TImage[];
  imageId?: ImageId;
  collections: Collection[];
  collectionId?: CollectionId;
  homePages: HomePage[];
  homePageId?: HomePageId;
  openModal?: (featuredCollectionSection?: FeaturedCollectionSection) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<FeaturedCollectionSection>(
      insertFeaturedCollectionSectionParams,
    );
  const editing = !!featuredCollectionSection?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('featured-collection-sections');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: FeaturedCollectionSection },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`FeaturedCollectionSection ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (
    { imageId }: { imageId: string | undefined },
    data: FormData,
  ) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const featuredCollectionSectionParsed =
      await insertFeaturedCollectionSectionParams.safeParseAsync({
        imageId,
        collectionId,
        homePageId,
        ...payload,
      });
    if (!featuredCollectionSectionParsed.success) {
      setErrors(featuredCollectionSectionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = featuredCollectionSectionParsed.data;
    const pendingFeaturedCollectionSection: FeaturedCollectionSection = {
      id: featuredCollectionSection?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingFeaturedCollectionSection,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateFeaturedCollectionSectionAction({
              ...values,
              id: featuredCollectionSection.id,
            })
          : await createFeaturedCollectionSectionAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingFeaturedCollectionSection,
        };
        onSuccess(
          editing ? 'update' : 'create',
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  const { addOptimisticImage } = useOptimisticImages(images);
  const [activeImage, setActiveImage] = useState<TImage | null>(null);
  const [open, setOpen] = useState(false);
  const openImageModal = (image?: TImage) => {
    setOpen(true);
    image ? setActiveImage(image) : setActiveImage(null);
  };
  const closeImageModal = () => setOpen(false);

  const handleSubmitWrapper = handleSubmit.bind(null, {
    imageId: activeImage?.id,
  });

  return (
    <form
      action={handleSubmitWrapper}
      onChange={handleChange}
      className={'space-y-8'}
    >
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.title ? 'text-destructive' : '',
          )}
        >
          Title
        </Label>
        <Input
          type="text"
          name="title"
          className={cn(errors?.title ? 'ring ring-destructive' : '')}
          defaultValue={featuredCollectionSection?.title ?? ''}
        />
        {errors?.title ? (
          <p className="text-xs text-destructive mt-2">{errors.title[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.callToAction ? 'text-destructive' : '',
          )}
        >
          Call To Action
        </Label>
        <Input
          type="text"
          name="callToAction"
          className={cn(errors?.callToAction ? 'ring ring-destructive' : '')}
          defaultValue={featuredCollectionSection?.callToAction ?? ''}
        />
        {errors?.callToAction ? (
          <p className="text-xs text-destructive mt-2">
            {errors.callToAction[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {imageId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.imageId ? 'text-destructive' : '',
            )}
          >
            Image
          </Label>

          {activeImage && (
            <div className="w-full h-40">
              <Image
                src={activeImage.url}
                alt=""
                height={240 / 2}
                width={240 / 2}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {featuredCollectionSection?.imageId ? null : (
            <>
              <Modal
                open={open}
                setOpen={setOpen}
                title={activeImage ? 'Edit Image' : 'Create Image'}
              >
                <ImageForm
                  image={activeImage}
                  addOptimistic={addOptimisticImage}
                  openModal={openImageModal}
                  closeModal={closeImageModal}
                  setActiveImage={setActiveImage}
                />
              </Modal>
              {!activeImage && (
                <div className="w-full">
                  <Button
                    className="w-full"
                    type="button"
                    onClick={() => openImageModal()}
                  >
                    Upload Image
                  </Button>
                </div>
              )}
            </>
          )}

          {errors?.imageId ? (
            <p className="text-xs text-destructive mt-2">{errors.imageId[0]}</p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.collectionId ? 'text-destructive' : '',
          )}
        >
          Collection
        </Label>
        <Select
          defaultValue={featuredCollectionSection?.collectionId}
          name="collectionId"
        >
          <SelectTrigger
            className={cn(errors?.collectionId ? 'ring ring-destructive' : '')}
          >
            <SelectValue placeholder="Select a collection" />
          </SelectTrigger>
          <SelectContent>
            {collections?.map((collection) => (
              <SelectItem key={collection.id} value={collection.id.toString()}>
                {collection.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.collectionId ? (
          <p className="text-xs text-destructive mt-2">
            {errors.collectionId[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {homePageId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.homePageId ? 'text-destructive' : '',
            )}
          >
            HomePage
          </Label>
          <Select
            defaultValue={featuredCollectionSection?.homePageId}
            name="homePageId"
          >
            <SelectTrigger
              className={cn(errors?.homePageId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a homePage" />
            </SelectTrigger>
            <SelectContent>
              {homePages?.map((homePage) => (
                <SelectItem key={homePage.id} value={homePage.id.toString()}>
                  {homePage.id}
                  {/* TODO: Replace with a field from the homePage model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.homePageId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.homePageId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={'destructive'}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic &&
                addOptimistic({
                  action: 'delete',
                  data: featuredCollectionSection,
                });
              const error = await deleteFeaturedCollectionSectionAction(
                featuredCollectionSection.id,
              );
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: featuredCollectionSection,
              };

              onSuccess('delete', error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? 'ing...' : 'e'}
        </Button>
      ) : null}
    </form>
  );
};

export default FeaturedCollectionSectionForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? 'ing...' : 'e'}`
        : `Creat${isCreating ? 'ing...' : 'e'}`}
    </Button>
  );
};
