import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/collection-images/useOptimisticCollectionImages';

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
  type CollectionImage,
  insertCollectionImageParams,
} from '@/lib/db/schema/collectionImages';
import {
  createCollectionImageAction,
  deleteCollectionImageAction,
  updateCollectionImageAction,
} from '@/lib/actions/collectionImages';
import { type TImage as TImage, type ImageId } from '@/lib/db/schema/images';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';

import Modal from '../shared/Modal';
import ImageForm from '../images/ImageForm';
import { useOptimisticImages } from '@/app/(app)/admin/images/useOptimisticImages';
import Image from 'next/image';

const CollectionImageForm = ({
  images,
  imageId,
  collections,
  collectionId,
  collectionImage,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  collectionImage?: CollectionImage | null;
  images: TImage[];
  imageId?: ImageId;
  collections: Collection[];
  collectionId?: CollectionId;
  openModal?: (collectionImage?: CollectionImage) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<CollectionImage>(insertCollectionImageParams);
  const editing = !!collectionImage?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('collection-images');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: CollectionImage },
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
      toast.success(`CollectionImage ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (
    { imageId }: { imageId: string | undefined },
    data: FormData,
  ) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const collectionImageParsed =
      await insertCollectionImageParams.safeParseAsync({
        imageId,
        collectionId,
        ...payload,
      });
    if (!collectionImageParsed.success) {
      setErrors(collectionImageParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = collectionImageParsed.data;
    const pendingCollectionImage: CollectionImage = {
      updatedAt: collectionImage?.updatedAt ?? new Date(),
      createdAt: collectionImage?.createdAt ?? new Date(),
      id: collectionImage?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingCollectionImage,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateCollectionImageAction({
              ...values,
              id: collectionImage.id,
            })
          : await createCollectionImageAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingCollectionImage,
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

      {imageId ? null : (
        <div>
          <Label
            className={cn(
              'my-2 inline-block',
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

          {collectionImage?.imageId ? null : (
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

      {collectionId ? null : (
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
            defaultValue={collectionImage?.collectionId}
            name="collectionId"
          >
            <SelectTrigger
              className={cn(
                errors?.collectionId ? 'ring ring-destructive' : '',
              )}
            >
              <SelectValue placeholder="Select a collection" />
            </SelectTrigger>
            <SelectContent>
              {collections?.map((collection) => (
                <SelectItem
                  key={collection.id}
                  value={collection.id.toString()}
                >
                  {collection.id}
                  {/* TODO: Replace with a field from the collection model */}
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
                addOptimistic({ action: 'delete', data: collectionImage });
              const error = await deleteCollectionImageAction(
                collectionImage.id,
              );
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: collectionImage,
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

export default CollectionImageForm;

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
