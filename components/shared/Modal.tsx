import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Modal({
  title,
  open,
  setOpen,
  children,
}: {
  title?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetContent>
        <SheetHeader className="px-5 pt-5">
          <SheetTitle>{title ?? 'Modal'}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[75vh]">
          <div className="px-5 pb-5">{children}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
