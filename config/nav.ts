import { SidebarLink } from '@/components/SidebarItems';
import { Cog, Globe, HomeIcon } from 'lucide-react';

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: '/dashboard', title: 'Home', icon: HomeIcon },
  { href: '/account', title: 'Account', icon: Cog },
  { href: '/settings', title: 'Settings', icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: 'Entities',
    links: [
      {
        href: '/delivery-zones',
        title: 'Delivery Zones',
        icon: Globe,
      },
      {
        href: '/tags',
        title: 'Tags',
        icon: Globe,
      },
      {
        href: '/images',
        title: 'Images',
        icon: Globe,
      },
    ],
  },
];
