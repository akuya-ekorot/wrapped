import { SidebarLink } from '@/components/SidebarItems';
import { Banknote, Cog, Globe, HomeIcon, Library, ShoppingBasket, Tag, Tags, Truck } from 'lucide-react';

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
        href: '/admin/orders',
        title: 'Orders',
        icon: ShoppingBasket,
      },
      {
        href: '/admin/payments',
        title: 'Payments',
        icon: Banknote,
      },
      {
        href: '/admin/collections',
        title: 'Collections',
        icon: Library,
      },
      {
        href: '/admin/products',
        title: 'Products',
        icon: Tag,
      },
      {
        href: '/admin/delivery-zones',
        title: 'Delivery Zones',
        icon: Truck,
      },
      {
        href: '/admin/tags',
        title: 'Tags',
        icon: Tags,
      },
    ],
  },
];
