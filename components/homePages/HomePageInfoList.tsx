import { HomePage } from '@/lib/db/schema/homePages';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function HomePageInfoList({ homePage }: { homePage: HomePage }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {homePage.description && (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="space-y-2">{'Description'}</CardTitle>
          </CardHeader>
          <CardContent>{homePage.description}</CardContent>
        </Card>
      )}
    </div>
  );
}
