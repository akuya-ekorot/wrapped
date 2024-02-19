import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ContentBlock } from '@/lib/db/schema/contentBlocks';

export default function ContentBlockInfoList({
  contentBlock,
}: {
  contentBlock: ContentBlock;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="space-y-2">{'Content'}</CardTitle>
        </CardHeader>
        <CardContent>{contentBlock.content}</CardContent>
      </Card>
    </div>
  );
}
