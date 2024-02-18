'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { defaultLinks, additionalLinks } from '@/config/nav';
import { useEffect, useState } from 'react';

export interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

import { getOrdersTotalAction } from '@/lib/actions/orders';
import { Badge } from './ui/badge';

const SidebarItems = () => {
  return (
    <>
      <SidebarLinkGroup links={defaultLinks} />
      {additionalLinks.length > 0
        ? additionalLinks.map((l) => (
            <SidebarLinkGroup
              links={l.links}
              title={l.title}
              border
              key={l.title}
            />
          ))
        : null}
    </>
  );
};
export default SidebarItems;

const SidebarLinkGroup = ({
  links,
  title,
  border,
}: {
  links: SidebarLink[];
  title?: string;
  border?: boolean;
}) => {
  const fullPathname = usePathname();
  const pathname =
    '/admin' +
    (fullPathname.split('/')[2] ? `/${fullPathname.split('/')[2]}` : '');

  console.log(pathname);

  return (
    <div className={border ? 'border-border border-t my-8 pt-4' : ''}>
      {title ? (
        <h4 className="px-2 mb-2 text-xs uppercase text-muted-foreground tracking-wider">
          {title}
        </h4>
      ) : null}
      <ul>
        {links.map((link) => (
          <li key={link.title}>
            <SidebarLink link={link} active={pathname === link.href} />
          </li>
        ))}
      </ul>
    </div>
  );
};
const SidebarLink = ({
  link,
  active,
}: {
  link: SidebarLink;
  active: boolean;
}) => {
  const [newOrders, setNewOrders] = useState<number>(0);

  useEffect(() => {
    if (link.href.includes('orders')) {
      getOrdersTotalAction().then((res) => {
        setNewOrders(res);
      });
    }
  }, [link.href]);

  return (
    <Link
      href={link.href}
      className={`group transition-colors p-2 inline-block hover:bg-popover hover:text-primary text-muted-foreground text-xs hover:shadow rounded-md w-full${
        active ? ' text-primary font-semibold' : ''
      }`}
    >
      <div className="flex items-center">
        <div
          className={cn(
            'opacity-0 left-0 h-6 w-[4px] absolute rounded-r-lg bg-primary',
            active ? 'opacity-100' : '',
          )}
        />
        <link.icon className="h-3.5 mr-1" />
        <span>{link.title}</span>
        {link.href.includes('orders') && newOrders > 0 && (
          <Badge className="ml-auto">{newOrders}</Badge>
        )}
      </div>
    </Link>
  );
};
