import StoreFrontTheme from '@/components/themes/storefront-theme';

export default function StoreFrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreFrontTheme>{children}</StoreFrontTheme>;
}
