import StoreFrontTheme from '@/components/themes/storefront-theme';
import { StorefrontNavBar } from './StorefrontNavBar';

export default function StoreFrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreFrontTheme>
      <StorefrontNavBar />
      {children}
    </StoreFrontTheme>
  );
}
