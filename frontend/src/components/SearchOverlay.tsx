'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { getBestsellers, searchProducts } from '@/lib/catalog';
import { formatPrice } from '@/lib/utils';

interface SearchOverlayProps {
  onClose: () => void;
}

const POPULAR = [
  'Outerwear',
  'Denim',
  'Hoodie',
  'Tee',
  'Bag',
  'Jacket',
];

const QUICK_LINKS = [
  { label: 'Men', href: '/collections/men' },
  { label: 'Women', href: '/collections/women' },
  { label: 'Accessories', href: '/collections/accessories' },
  { label: 'Shop all', href: '/shop' },
];

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 220);
  }, [onClose]);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  const results = useMemo(() => searchProducts(query).slice(0, 8), [query]);
  const suggestions = getBestsellers().slice(0, 3);
  const trimmed = query.trim();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className={`fixed inset-0 z-50 overflow-y-auto bg-brand-bg transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="mx-auto flex min-h-full max-w-[1400px] flex-col px-5 lg:px-10">
        {/* Search bar */}
        <div className="flex items-center gap-4 border-b border-brand-fg py-5 lg:gap-5 lg:py-7">
          <Search className="h-5 w-5 shrink-0 text-brand-muted" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the collection"
            aria-label="Search products"
            className="h-10 w-full flex-1 bg-transparent font-display text-2xl font-semibold uppercase tracking-[0.01em] text-brand-fg placeholder:text-brand-muted/50 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none lg:text-4xl"
          />
          <button
            onClick={handleClose}
            className="flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-brand-muted transition-colors hover:text-brand-fg"
            aria-label="Close search"
          >
            <span className="hidden sm:inline">Close</span>
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 py-9 lg:py-14">
          {trimmed ? (
            <>
              <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-brand-muted">
                  {results.length} {results.length === 1 ? 'piece' : 'pieces'} for
                  &ldquo;{trimmed}&rdquo;
                </p>
                <Link
                  href={`/shop?q=${encodeURIComponent(trimmed)}`}
                  onClick={handleClose}
                  className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-fg"
                >
                  View all results
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
              </div>

              {results.length === 0 ? (
                <div className="max-w-md">
                  <p className="font-display text-3xl font-semibold uppercase leading-none">
                    Nothing matched.
                  </p>
                  <p className="mt-3 text-[13px] leading-6 text-brand-muted">
                    Try a fabric, a category or a colour — or browse the full
                    collection.
                  </p>
                  <Link
                    href="/shop"
                    onClick={handleClose}
                    className="mt-6 inline-flex h-11 items-center gap-3 bg-brand-fg px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-bg transition-colors hover:bg-brand-accent hover:text-white"
                  >
                    Shop all pieces
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-brand-border">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={handleClose}
                        className="group flex items-center gap-5 py-4 sm:gap-7"
                      >
                        <div className="relative aspect-[3/4] w-[54px] shrink-0 overflow-hidden bg-brand-surface sm:w-[68px]">
                          {product.images?.[0] && (
                            <Image
                              src={product.images[0].image_url}
                              alt={product.images[0].alt_text || product.name}
                              fill
                              sizes="68px"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[8px] uppercase tracking-[0.18em] text-brand-muted">
                            {product.subcategory ?? product.category?.name}
                          </p>
                          <h4 className="mt-1 font-sans text-[15px] font-medium text-brand-fg transition-colors group-hover:text-brand-accent">
                            {product.name}
                          </h4>
                          <p className="mt-0.5 hidden text-[12px] text-brand-muted sm:block">
                            {product.subtitle}
                          </p>
                        </div>
                        <span className="shrink-0 text-[12px] font-semibold tabular-nums text-brand-fg">
                          {formatPrice(product.price)}
                        </span>
                        <ArrowRight
                          className="hidden h-4 w-4 shrink-0 text-brand-muted transition-transform duration-500 group-hover:translate-x-1.5 sm:block"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
              {/* Suggestions */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.26em] text-brand-muted">
                  Popular searches
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {POPULAR.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="border border-brand-border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-brand-fg transition-colors duration-300 hover:border-brand-fg"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <p className="mt-12 text-[9px] uppercase tracking-[0.26em] text-brand-muted">
                  Browse
                </p>
                <ul className="mt-5 max-w-sm divide-y divide-brand-border border-y border-brand-border">
                  {QUICK_LINKS.map((link, i) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={handleClose}
                        className="group flex items-center justify-between py-4"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="w-5 text-[9px] tabular-nums tracking-[0.16em] text-brand-muted">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-display text-2xl font-semibold uppercase leading-none text-brand-fg transition-colors group-hover:text-brand-accent">
                            {link.label}
                          </span>
                        </span>
                        <ArrowRight
                          className="h-4 w-4 text-brand-muted transition-transform duration-500 group-hover:translate-x-1.5"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Most wanted */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.26em] text-brand-muted">
                  Most wanted
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-5">
                  {suggestions.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={handleClose}
                      className="group block"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-brand-surface">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0].image_url}
                            alt={product.images[0].alt_text || product.name}
                            fill
                            sizes="(max-width: 640px) 30vw, 20vw"
                            className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                            unoptimized
                          />
                        )}
                      </div>
                      <p className="mt-3 text-[12px] font-medium leading-snug text-brand-fg transition-colors group-hover:text-brand-accent">
                        {product.name}
                      </p>
                      <p className="text-[11px] tabular-nums text-brand-muted">
                        {formatPrice(product.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-brand-border py-5">
          <p className="text-[9px] uppercase tracking-[0.22em] text-brand-muted">
            Maison Valère — Paris · Press Esc to close
          </p>
        </div>
      </div>
    </div>
  );
}
