import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Collection, CollectionStatus } from '@/lib/db/schema/collections';

export default function CollectionInfoList({
  collection,
}: {
  collection: Collection;
}) {
  CollectionStatus;
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{collection.name}</CardTitle>
        </CardHeader>
        <CardContent>Name</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{collection.slug}</CardTitle>
        </CardHeader>
        <CardContent>Slug</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">
            {
              Object.entries(CollectionStatus).find(
                ([_, value]) => value === collection.status,
              )![0]
            }
          </CardTitle>
        </CardHeader>
        <CardContent>Status</CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="space-y-2">Description</CardTitle>
        </CardHeader>
        <CardContent>{collection.description}</CardContent>
      </Card>
    </div>
  );
}
