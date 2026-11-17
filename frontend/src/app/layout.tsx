import type { Metadata } from 'next';
import { Archivo, Barlow_Condensed } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/lib/wishlist-context';
import CartDrawer from '@/components/CartDrawer';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
});

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-barlow',
  display: 'swap',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maison-valere.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Maison Valère — Contemporary Workwear & Essentials',
    template: '%s | Maison Valère',
  },
  description:
    'Maison Valère is a Paris label re-cutting the workwear wardrobe: rigid denim, heavyweight fleece, honest outerwear and everyday essentials, made in Europe.',
  keywords: [
    'contemporary workwear',
    'Paris fashion label',
    'streetwear essentials',
    'designer denim',
    'heavyweight hoodie',
    'utility jacket',
    'graphic tees',
    'everyday fashion',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Maison Valère',
    title: 'Maison Valère — Contemporary Workwear & Essentials',
    description:
      'Workwear proportions, Parisian cut. Rigid denim, heavyweight fleece and honest outerwear, made in Europe.',
    url: '/',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=1600&h=900&q=80',
        width: 1600,
        height: 900,
        alt: 'Maison Valère — Autumn Winter 2026 campaign',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maison Valère — Contemporary Workwear & Essentials',
    description:
      'Workwear proportions, Parisian cut. Made in Europe, built to be worn in.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${barlow.variable}`}>
      <body>
        <CartProvider>
          <WishlistProvider>
            {children}
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
