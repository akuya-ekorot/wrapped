import { Option } from '@/lib/db/schema/options';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function OptionInfoList({ option }: { option: Option }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{option.name}</CardTitle>
        </CardHeader>
        <CardContent>Name</CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="space-y-2">{'Description'}</CardTitle>
        </CardHeader>
        <CardContent>{option.description}</CardContent>
      </Card>
    </div>
  );
}
