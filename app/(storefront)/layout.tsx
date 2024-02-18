import StoreFrontTheme from '@/components/themes/storefront-theme';
import { StorefrontNavBar } from '../../components/navbar/StorefrontNavBar';

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
