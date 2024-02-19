import { SidebarLink } from '@/components/SidebarItems';
import {
  Banknote,
  Cog,
  Files,
  Globe,
  Home,
  HomeIcon,
  Library,
  Link,
  ShoppingBasket,
  Tag,
  Tags,
  Truck,
  Users,
} from 'lucide-react';

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: '/admin', title: 'Home', icon: HomeIcon },
  { href: '/admin/account', title: 'Account', icon: Cog },
  { href: '/admin/settings', title: 'Settings', icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: 'Shop management',
    links: [
      {
        href: '/admin/orders',
        title: 'Orders',
        icon: ShoppingBasket,
      },
      {
        href: '/admin/customers',
        title: 'customers',
        icon: Users,
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
    ],
  },
  {
    title: 'Pages management',
    links: [
      {
        href: '/admin/home-pages',
        title: 'Home Page',
        icon: Home,
      },
      {
        href: '/admin/pages',
        title: 'Pages',
        icon: Files,
      },
    ],
  },
];
