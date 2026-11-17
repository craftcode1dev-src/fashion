import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PRODUCTS, CATEGORIES } from '@/lib/catalog';
import ShopContent, { type ShopMode } from './ShopContent';

export const metadata: Metadata = {
  title: 'Shop All',
  description:
    'Shop the full Maison Valère collection — rigid denim, heavyweight fleece, honest outerwear and everyday essentials, made in Europe.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const { filter, q } = await searchParams;
  const initialMode: ShopMode =
    filter === 'new'
      ? 'new'
      : filter === 'bestseller'
        ? 'bestseller'
        : filter === 'sale'
          ? 'sale'
          : 'all';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        {/* Page header */}
        <div className="mx-auto max-w-[1600px] px-5 pt-12 lg:px-10 lg:pt-16">
          <p className="mb-4 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-muted">
            <span className="h-px w-7 bg-brand-accent" />
            <span>Shop — Autumn / Winter 2026</span>
          </p>
          <div className="flex flex-col gap-5 border-b border-brand-border pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] font-bold uppercase leading-[0.82] tracking-[-0.015em]">
              All pieces
              <sup className="ml-3 align-super font-sans text-[10px] font-medium tracking-[0.16em] text-brand-muted">
                ({String(PRODUCTS.length).padStart(2, '0')})
              </sup>
            </h1>
            <p className="max-w-sm text-[13px] leading-6 text-brand-muted sm:text-right">
              Thirty-seven pieces, cut in Paris and made in Europe. Rigid denim,
              heavy fleece and honest outerwear — released in small runs, never
              repeated.
            </p>
          </div>
        </div>

        <ShopContent
          initialProducts={PRODUCTS}
          categories={CATEGORIES}
          initialMode={initialMode}
          initialQuery={q ?? ''}
        />
      </main>
      <Footer />
    </>
  );
}
