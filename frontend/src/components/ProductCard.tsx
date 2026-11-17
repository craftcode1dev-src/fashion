'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Plus } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
  tone?: 'light' | 'dark';
}

export default function ProductCard({
  product,
  priority = false,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  className = '',
  tone = 'light',
}: ProductCardProps) {
  const { addItem } = useCart();
  const { isSaved, toggle } = useWishlist();

  const saved = isSaved(product.slug);
  const hasDiscount =
    product.compare_at_price !== null && product.compare_at_price > product.price;
  const dark = tone === 'dark';

  const colors = product.variants
    ? Array.from(
        new Map(product.variants.map((v) => [v.color_name, v])).values()
      )
    : [];

  const firstAvailable = product.variants?.find((v) => v.stock > 0) ?? null;
  const soldOut = product.variants?.length > 0 && !firstAvailable;

  const primary = product.images?.[0];
  const secondary = product.images?.[1];

  function quickAdd() {
    if (soldOut) return;
    addItem(product, firstAvailable, 1);
  }

  return (
    <article className={`group relative ${className}`}>
      {/* Image */}
      <div
        className={`relative aspect-[3/4] overflow-hidden ${
          dark ? 'bg-white/5' : 'bg-brand-surface'
        }`}
      >
        <Link
          href={`/products/${product.slug}`}
          aria-label={product.name}
          className="absolute inset-0 z-10"
        >
          {primary ? (
            <>
              <Image
                src={primary.image_url}
                alt={primary.alt_text || product.name}
                fill
                priority={priority}
                sizes={sizes}
                className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.055]"
                unoptimized
              />
              {secondary && (
                <Image
                  src={secondary.image_url}
                  alt=""
                  fill
                  sizes={sizes}
                  aria-hidden="true"
                  className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  unoptimized
                />
              )}
            </>
          ) : (
            <div
              className={`flex h-full items-center justify-center text-[10px] uppercase tracking-[0.2em] ${
                dark ? 'text-white/40' : 'text-brand-muted'
              }`}
            >
              Maison Valère
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-20 flex flex-col items-start gap-1.5">
          {product.is_new_arrival && (
            <span className="bg-brand-fg px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-brand-bg">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="bg-brand-accent px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-white">
              Sale
            </span>
          )}
          {!product.is_new_arrival && product.is_bestseller && (
            <span
              className={`px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] ${
                dark
                  ? 'bg-brand-bg text-brand-fg'
                  : 'border border-brand-fg/20 bg-brand-bg/95 text-brand-fg'
              }`}
            >
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggle(product.slug)}
          aria-label={
            saved
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          aria-pressed={saved}
          className={`absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ${
            dark
              ? 'bg-brand-charcoal/80 text-brand-bg hover:bg-brand-charcoal'
              : 'bg-brand-bg/85 text-brand-fg hover:bg-brand-bg'
          } ${
            saved
              ? 'opacity-100'
              : 'opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100'
          }`}
        >
          <Heart
            className={`h-[15px] w-[15px] transition-colors ${
              saved ? 'animate-heart-pop fill-brand-accent text-brand-accent' : ''
            }`}
            strokeWidth={1.5}
          />
        </button>

        {/* Quick add — desktop */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-20 hidden lg:block">
          <button
            type="button"
            onClick={quickAdd}
            disabled={soldOut}
            className={`h-10 w-full translate-y-2 text-[9px] font-semibold uppercase tracking-[0.2em] opacity-0 shadow-sm backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 ${
              dark
                ? 'bg-brand-bg text-brand-fg hover:bg-brand-accent hover:text-white'
                : 'bg-brand-bg/95 text-brand-fg hover:bg-brand-fg hover:text-brand-bg'
            } ${soldOut ? 'cursor-not-allowed text-brand-muted' : ''}`}
          >
            {soldOut ? 'Sold Out' : 'Quick Add'}
          </button>
        </div>

        {/* Quick add — mobile */}
        <button
          type="button"
          onClick={quickAdd}
          disabled={soldOut}
          aria-label={
            soldOut
              ? `${product.name} is sold out`
              : `Quick add ${product.name} to bag`
          }
          className={`absolute bottom-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors disabled:opacity-40 lg:hidden ${
            dark
              ? 'bg-brand-bg/90 text-brand-fg'
              : 'bg-brand-bg/90 text-brand-fg hover:bg-brand-bg'
          }`}
        >
          <Plus className="h-4 w-4" strokeWidth={1.6} />
        </button>
      </div>

      {/* Info */}
      <div className="mt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={`mb-1 text-[8px] font-medium uppercase tracking-[0.18em] ${
                dark ? 'text-brand-bg/45' : 'text-brand-muted'
              }`}
            >
              {product.subcategory ?? product.category?.name}
            </p>
            <h3
              className={`font-sans text-[13px] font-medium leading-snug tracking-[0.005em] ${
                dark ? 'text-brand-bg' : 'text-brand-fg'
              }`}
            >
              <Link
                href={`/products/${product.slug}`}
                className={`transition-colors duration-300 ${
                  dark ? 'hover:text-brand-accent' : 'hover:text-brand-accent'
                }`}
              >
                {product.name}
              </Link>
            </h3>
          </div>

          <div className="shrink-0 text-right tabular-nums">
            <p
              className={`text-[12px] font-semibold ${
                hasDiscount
                  ? 'text-brand-accent'
                  : dark
                    ? 'text-brand-bg'
                    : 'text-brand-fg'
              }`}
            >
              {formatPrice(product.price)}
            </p>
            {hasDiscount && (
              <p
                className={`text-[10px] line-through ${
                  dark ? 'text-brand-bg/35' : 'text-brand-muted/70'
                }`}
              >
                {formatPrice(product.compare_at_price!)}
              </p>
            )}
          </div>
        </div>

        {colors.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5">
            {colors.slice(0, 4).map((color) => (
              <span
                key={color.color_name}
                title={color.color_name}
                className={`h-2.5 w-2.5 rounded-full border ${
                  dark ? 'border-white/25' : 'border-brand-border'
                }`}
                style={{ backgroundColor: color.color_hex }}
              />
            ))}
            {colors.length > 4 && (
              <span
                className={`text-[8px] ${
                  dark ? 'text-brand-bg/40' : 'text-brand-muted'
                }`}
              >
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
