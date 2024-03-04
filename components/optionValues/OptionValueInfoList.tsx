import { OptionValue } from '@/lib/db/schema/optionValues';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function OptionValueInfoList({
  optionValue,
}: {
  optionValue: OptionValue;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="space-y-2">{optionValue.name}</CardTitle>
        </CardHeader>
        <CardContent>Name</CardContent>
      </Card>
      {optionValue.description && (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="space-y-2">{'Description'}</CardTitle>
          </CardHeader>
          <CardContent>{optionValue.description}</CardContent>
        </Card>
      )}
    </div>
  );
}
