'use client';

import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/catalog';
import { useWishlist } from '@/lib/wishlist-context';

export default function WishlistPage() {
  const { slugs, hydrated, clear } = useWishlist();
  const products = getAllProducts().filter((product) => slugs.includes(product.slug));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-10 lg:px-10 lg:pt-14">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-brand-border pb-7">
            <div>
              <p className="mb-3 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.26em] text-brand-muted">
                <span className="h-px w-7 bg-brand-accent" />
                Saved pieces
              </p>
              <h1 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-bold uppercase leading-[0.82] tracking-[-0.015em]">
                Wishlist
                <sup className="ml-3 align-super font-sans text-[10px] font-medium tracking-[0.16em] text-brand-muted">
                  ({String(products.length).padStart(2, '0')})
                </sup>
              </h1>
            </div>
            {products.length > 0 && (
              <button
                onClick={clear}
                className="pb-1 text-[9px] uppercase tracking-[0.16em] text-brand-muted underline underline-offset-4 transition-colors hover:text-brand-fg"
              >
                Clear all
              </button>
            )}
          </div>

          {!hydrated ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 pt-8 sm:gap-x-5 sm:grid-cols-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="aspect-[3/4] animate-pulse bg-brand-surface" />
                  <div className="mt-4 h-3 w-2/3 animate-pulse bg-brand-surface" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
              <div>
                <Heart className="mb-7 h-7 w-7 text-brand-muted/60" strokeWidth={1.25} />
                <h2 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em]">
                  Nothing saved,
                  <br />
                  yet<span className="text-brand-accent">.</span>
                </h2>
                <p className="mt-6 max-w-sm text-[13px] leading-6 text-brand-muted">
                  Tap the heart on any piece to keep it here. Your wishlist stays
                  in this browser, ready when you are.
                </p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  <Link
                    href="/collections/new-arrivals"
                    className="inline-flex h-12 items-center gap-2.5 bg-brand-fg px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-bg transition-colors hover:bg-brand-accent hover:text-white"
                  >
                    Shop new arrivals
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex h-12 items-center border border-brand-border px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-fg transition-colors hover:border-brand-fg"
                  >
                    All pieces
                  </Link>
                </div>
              </div>
              <div className="hidden border-l border-brand-border pl-12 lg:block">
                <p className="text-[9px] uppercase tracking-[0.24em] text-brand-muted">
                  The icons
                </p>
                <p className="mt-5 font-display text-3xl font-semibold uppercase leading-none">
                  Not sure where to begin?
                </p>
                <p className="mt-3 max-w-xs text-[13px] leading-6 text-brand-muted">
                  Start with the pieces our customers return to — the leather moto,
                  the heavyweight hoodie, the light-wash straight jean.
                </p>
                <Link
                  href="/collections/best-sellers"
                  className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-fg underline underline-offset-4"
                >
                  Explore best sellers
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 pt-8 sm:gap-x-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
