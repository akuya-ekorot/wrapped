import { HeroSection } from '@/lib/db/schema/heroSections';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function HeroSectionInfoList({
  heroSection,
}: {
  heroSection: HeroSection;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{heroSection.title}</CardTitle>
        </CardHeader>
        <CardContent>Title</CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">
            {heroSection.callToAction}
          </CardTitle>
        </CardHeader>
        <CardContent>Call to Action</CardContent>
      </Card>
    </div>
  );
}
