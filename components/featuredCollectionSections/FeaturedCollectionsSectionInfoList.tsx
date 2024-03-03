import { CompleteFeaturedCollectionSection } from '@/lib/db/schema/featuredCollectionSections';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Collection } from '@/lib/db/schema/collections';

export default function FeaturedCollectionSectionInfoList({
  featuredCollectionSection,
}: {
  featuredCollectionSection: CompleteFeaturedCollectionSection;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">
            {featuredCollectionSection.title}
          </CardTitle>
        </CardHeader>
        <CardContent>Title</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">
            {featuredCollectionSection.callToAction}
          </CardTitle>
        </CardHeader>
        <CardContent>Call to Action</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">
            {featuredCollectionSection.collection?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>Featured Collection</CardContent>
      </Card>
    </div>
  );
}
