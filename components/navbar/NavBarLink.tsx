import Link from 'next/link';

export function NavBarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="h-12 w-12 flex items-center justify-center" href={href}>
      {children}
    </Link>
  );
}
