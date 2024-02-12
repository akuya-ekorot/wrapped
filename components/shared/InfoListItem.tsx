export default function InfoListItem({
  title,
  value,
  secondaryValue,
}: {
  title: string;
  value: string | number | Date | null;
  secondaryValue?: string | number | Date | null;
}) {
  const displayValue = value
    ? value instanceof Date
      ? value.toLocaleString()
      : value
    : 'N/A';

  const displaySecondaryValue = secondaryValue
    ? secondaryValue instanceof Date
      ? secondaryValue.toLocaleString()
      : secondaryValue
    : 'N/A';

  return (
    <div className="space-y-2 p-4 rounded-md bg-secondary text-secondary-foreground">
      <p className="text-sm font-semibold">{title}</p>
      <p>{displayValue}</p>
      {secondaryValue && <p>{displaySecondaryValue}</p>}
    </div>
  );
}
