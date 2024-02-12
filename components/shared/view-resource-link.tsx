import { Eye } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const ViewResourceLink = ({
  id,
  resourceName,
}: {
  id: string;
  resourceName: string;
}) => {
  const pathname = usePathname();
  const basePath = pathname.includes(resourceName)
    ? pathname
    : pathname + `/${resourceName}/`;

  return (
    <Link className="flex items-center gap-2" href={`${basePath}/${id}`}>
      <Eye className="w-4 h-4" />
      <span>{`View ${resourceName.slice(0, -1)} details`}</span>
    </Link>
  );
};
