import { Page } from '@/lib/db/schema/pages';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function PageInfoList({ page: page }: { page: Page }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{page.title}</CardTitle>
        </CardHeader>
        <CardContent>Page Title</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{page.slug}</CardTitle>
        </CardHeader>
        <CardContent>Page Slug</CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="space-y-2">{'Description'}</CardTitle>
        </CardHeader>
        <CardContent>{page.description}</CardContent>
      </Card>
    </div>
  );
}
