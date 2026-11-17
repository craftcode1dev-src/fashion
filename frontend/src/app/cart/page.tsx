'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { formatPrice } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const FREE_SHIPPING_THRESHOLD = 250;

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, isHydrated } = useCart();
  const { toggle } = useWishlist();
  const [saved, setSaved] = useState<string[]>([]);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 35;
  const total = subtotal + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  function moveToWishlist(slug: string, productId: number, variantId: number | null) {
    toggle(slug);
    removeItem(productId, variantId);
    setSaved((prev) => [...prev, slug]);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-10 lg:px-10 lg:pt-14">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-brand-border pb-7">
            <div>
              <p className="mb-3 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.26em] text-brand-muted">
                <span className="h-px w-7 bg-brand-accent" />
                Your selection
              </p>
              <h1 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-bold uppercase leading-[0.82] tracking-[-0.015em]">
                Your bag
                <sup className="ml-3 align-super font-sans text-[10px] font-medium tracking-[0.16em] text-brand-muted">
                  ({String(count).padStart(2, '0')})
                </sup>
              </h1>
            </div>
            {items.length > 0 && (
              <p className="pb-1 text-[9px] uppercase tracking-[0.18em] text-brand-muted">
                {remaining > 0
                  ? `${formatPrice(remaining)} to free shipping`
                  : 'Free shipping applied'}
              </p>
            )}
          </div>

          {!isHydrated ? (
            <div className="grid gap-12 py-16 lg:grid-cols-[1fr_360px]">
              <div className="space-y-8">
                {[0, 1].map((i) => (
                  <div key={i} className="flex gap-5">
                    <div className="h-36 w-28 animate-pulse bg-brand-surface" />
                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-3 w-2/5 animate-pulse bg-brand-surface" />
                      <div className="h-3 w-1/4 animate-pulse bg-brand-surface" />
                      <div className="h-8 w-24 animate-pulse bg-brand-surface" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
              <div>
                <h2 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em]">
                  Empty,
                  <br />
                  for now<span className="text-brand-accent">.</span>
                </h2>
                <p className="mt-6 max-w-sm text-[13px] leading-6 text-brand-muted">
                  Nothing selected yet. Start with the new arrivals, or explore
                  the pieces our customers return to.
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
                  Good to know
                </p>
                <ul className="mt-5 space-y-3.5 text-[13px] leading-6 text-brand-muted">
                  <li>Free shipping over €250</li>
                  <li>30-day free returns, collected from your door</li>
                  <li>Every order packed by hand in Paris</li>
                </ul>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-fg underline underline-offset-4"
                >
                  Contact us
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-10 pt-8 lg:grid-cols-[1fr_360px] lg:gap-14">
              {/* Items */}
              <div>
                <div className="hidden border-b border-brand-border pb-3 text-[9px] uppercase tracking-[0.18em] text-brand-muted sm:grid sm:grid-cols-[1fr_90px_120px_90px_32px] sm:items-center sm:gap-4">
                  <span>Piece</span>
                  <span className="text-right">Price</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Total</span>
                  <span />
                </div>

                <ul className="divide-y divide-brand-border">
                  {items.map((item) => {
                    const variantLabel = [item.variant?.color_name, item.variant?.size]
                      .filter(Boolean)
                      .join(' / ');
                    const unitPrice =
                      item.product.price + (item.variant?.price_modifier ?? 0);
                    return (
                      <li
                        key={`${item.product.id}-${item.variant?.id ?? 'none'}`}
                        className="py-5 sm:grid sm:grid-cols-[1fr_90px_120px_90px_32px] sm:items-center sm:gap-4"
                      >
                        <div className="flex gap-4">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="relative h-[136px] w-[102px] shrink-0 overflow-hidden bg-brand-surface"
                          >
                            {item.product.images?.[0] && (
                              <Image
                                src={item.product.images[0].image_url}
                                alt={item.product.images[0].alt_text || item.product.name}
                                fill
                                sizes="102px"
                                className="object-cover"
                                unoptimized
                              />
                            )}
                          </Link>
                          <div className="min-w-0 pt-0.5">
                            <p className="text-[8px] uppercase tracking-[0.16em] text-brand-muted">
                              {item.product.subcategory ?? item.product.category?.name}
                            </p>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="mt-1 block text-[14px] font-medium leading-snug text-brand-fg transition-colors hover:text-brand-accent"
                            >
                              {item.product.name}
                            </Link>
                            {variantLabel && (
                              <p className="mt-1.5 text-[10px] uppercase tracking-[0.1em] text-brand-muted">
                                {variantLabel}
                              </p>
                            )}
                            <p className="mt-2 text-[13px] font-semibold tabular-nums text-brand-fg sm:hidden">
                              {formatPrice(unitPrice * item.quantity)}
                            </p>
                            <button
                              onClick={() =>
                                moveToWishlist(
                                  item.product.slug,
                                  item.product.id,
                                  item.variant?.id ?? null
                                )
                              }
                              className="mt-3 text-[9px] uppercase tracking-[0.14em] text-brand-muted underline underline-offset-4 transition-colors hover:text-brand-fg"
                            >
                              Move to wishlist
                            </button>
                          </div>
                        </div>

                        <p className="hidden text-right text-[13px] tabular-nums text-brand-fg sm:block">
                          {formatPrice(unitPrice)}
                        </p>

                        <div className="mt-4 flex items-center justify-between sm:mt-0 sm:justify-center">
                          <div className="flex h-9 items-center border border-brand-border">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.variant?.id ?? null,
                                  item.quantity - 1
                                )
                              }
                              aria-label="Decrease quantity"
                              className="flex h-full w-8 items-center justify-center text-brand-muted transition-colors hover:text-brand-fg"
                            >
                              <Minus className="h-2.5 w-2.5" strokeWidth={2} />
                            </button>
                            <span className="w-6 text-center text-[11px] font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.variant?.id ?? null,
                                  item.quantity + 1
                                )
                              }
                              aria-label="Increase quantity"
                              className="flex h-full w-8 items-center justify-center text-brand-muted transition-colors hover:text-brand-fg"
                            >
                              <Plus className="h-2.5 w-2.5" strokeWidth={2} />
                            </button>
                          </div>
                          <button
                            onClick={() =>
                              removeItem(item.product.id, item.variant?.id ?? null)
                            }
                            aria-label={`Remove ${item.product.name}`}
                            className="text-brand-muted transition-colors hover:text-brand-fg sm:hidden"
                          >
                            <X className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>

                        <p className="hidden text-right text-[13px] font-semibold tabular-nums text-brand-fg sm:block">
                          {formatPrice(unitPrice * item.quantity)}
                        </p>

                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.variant?.id ?? null)
                          }
                          aria-label={`Remove ${item.product.name}`}
                          className="hidden justify-self-end text-brand-muted transition-colors hover:text-brand-fg sm:block"
                        >
                          <X className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-brand-border pt-5">
                  <Link
                    href="/shop"
                    className="group inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-fg"
                  >
                    <ArrowRight
                      className="h-3.5 w-3.5 rotate-180 transition-transform duration-500 group-hover:-translate-x-1"
                      strokeWidth={1.5}
                    />
                    Continue shopping
                  </Link>
                  <p className="text-[9px] uppercase tracking-[0.14em] text-brand-muted">
                    Prices include VAT
                  </p>
                </div>

                {saved.length > 0 && (
                  <p className="mt-5 text-[11px] leading-6 text-brand-muted">
                    Saved to your wishlist —{' '}
                    <Link
                      href="/wishlist"
                      className="text-brand-fg underline underline-offset-4"
                    >
                      view wishlist
                    </Link>
                    .
                  </p>
                )}
              </div>

              {/* Summary */}
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="border border-brand-border bg-brand-surface/70 p-6">
                  <h2 className="font-display text-2xl font-bold uppercase leading-none">
                    Summary
                  </h2>

                  <div className="mt-5 space-y-3 border-b border-brand-border pb-5 text-[13px]">
                    <div className="flex items-baseline justify-between">
                      <span className="text-brand-muted">Subtotal</span>
                      <span className="font-semibold tabular-nums text-brand-fg">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-brand-muted">Shipping</span>
                      <span className="font-semibold tabular-nums text-brand-fg">
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-4">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-brand-muted">
                      Total
                    </span>
                    <span className="font-display text-2xl font-bold tabular-nums leading-none">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-brand-fg text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-bg transition-colors duration-300 hover:bg-brand-accent hover:text-white"
                  >
                    Checkout
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Link>

                  <div className="mt-5">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-brand-muted">
                      {remaining > 0
                        ? `${formatPrice(remaining)} to free shipping`
                        : 'Free shipping applied'}
                    </p>
                    <div className="mt-2 h-[3px] w-full overflow-hidden bg-brand-border">
                      <div
                        className={`h-full transition-all duration-700 ${
                          remaining > 0 ? 'bg-brand-fg' : 'bg-brand-olive'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2 border-t border-brand-border pt-4 text-[10px] uppercase leading-5 tracking-[0.08em] text-brand-muted">
                    <li>Secure checkout · Visa, Mastercard, Amex</li>
                    <li>Free returns within 30 days</li>
                    <li>Packed by hand in Paris</li>
                  </ul>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
