'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 250;

export default function CartDrawer() {
  const { items, itemCount, subtotal, isCartOpen, closeCart, updateQuantity, removeItem } =
    useCart();
  const pathname = usePathname();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Close on route change
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  // Close on Escape
  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartOpen, closeCart]);

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-brand-fg/45 backdrop-blur-[2px] transition-opacity duration-500 ${
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        aria-hidden={!isCartOpen}
        className={`fixed inset-y-0 right-0 z-[61] flex w-full max-w-[430px] flex-col bg-brand-bg shadow-[-24px_0_60px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <div className="flex items-baseline gap-2.5">
            <h2 className="font-display text-2xl font-bold uppercase leading-none tracking-[0.01em]">
              Your bag
            </h2>
            <span className="text-[9px] uppercase tracking-[0.16em] text-brand-muted">
              ({String(itemCount).padStart(2, '0')})
            </span>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close shopping bag"
            className="p-1 text-brand-muted transition-colors duration-300 hover:text-brand-fg"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
            <ShoppingBag
              className="mb-5 h-7 w-7 text-brand-muted/50"
              strokeWidth={1.25}
            />
            <p className="font-display text-2xl font-semibold uppercase leading-none">
              Nothing in the bag
            </p>
            <p className="mt-3 max-w-[240px] text-[13px] leading-6 text-brand-muted">
              Start with the new arrivals, or browse the full AW26 collection.
            </p>
            <Link
              href="/collections/new-arrivals"
              onClick={closeCart}
              className="mt-7 inline-flex h-11 items-center gap-2.5 bg-brand-fg px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-bg transition-colors hover:bg-brand-accent hover:text-white"
            >
              Shop new arrivals
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-4 text-[10px] font-medium uppercase tracking-[0.16em] text-brand-muted underline underline-offset-4 transition-colors hover:text-brand-fg"
            >
              Or shop all pieces
            </Link>
          </div>
        ) : (
          <>
            {/* Shipping meter */}
            <div className="border-b border-brand-border px-5 py-3.5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[9px] uppercase tracking-[0.14em] text-brand-muted">
                  {remaining > 0 ? (
                    <>
                      <span className="text-brand-fg">{formatPrice(remaining)}</span>{' '}
                      to free shipping
                    </>
                  ) : (
                    <span className="text-brand-olive">Free shipping unlocked</span>
                  )}
                </p>
                <span className="text-[9px] tabular-nums tracking-[0.1em] text-brand-muted">
                  €250
                </span>
              </div>
              <div className="mt-2 h-[3px] w-full overflow-hidden bg-brand-border">
                <div
                  className={`h-full transition-all duration-700 ${
                    remaining > 0 ? 'bg-brand-fg' : 'bg-brand-olive'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <ul className="flex-1 divide-y divide-brand-border overflow-y-auto px-5">
              {items.map((item) => {
                const variantLabel = [item.variant?.color_name, item.variant?.size]
                  .filter(Boolean)
                  .join(' / ');
                const price =
                  (item.product.price + (item.variant?.price_modifier ?? 0)) *
                  item.quantity;
                return (
                  <li
                    key={`${item.product.id}-${item.variant?.id ?? 'none'}`}
                    className="flex gap-3.5 py-4"
                  >
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="relative h-[108px] w-[80px] shrink-0 overflow-hidden bg-brand-surface"
                    >
                      {item.product.images?.[0] && (
                        <Image
                          src={item.product.images[0].image_url}
                          alt={item.product.images[0].alt_text || item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={closeCart}
                            className="text-[13px] font-medium leading-snug text-brand-fg transition-colors hover:text-brand-accent"
                          >
                            {item.product.name}
                          </Link>
                          {variantLabel && (
                            <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-brand-muted">
                              {variantLabel}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.variant?.id ?? null)
                          }
                          aria-label={`Remove ${item.product.name}`}
                          className="shrink-0 p-0.5 text-brand-muted transition-colors hover:text-brand-fg"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-end justify-between pt-3">
                        <div className="flex h-8 items-center border border-brand-border">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.variant?.id ?? null,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                            className="flex h-full w-7 items-center justify-center text-brand-muted transition-colors hover:text-brand-fg"
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
                            className="flex h-full w-7 items-center justify-center text-brand-muted transition-colors hover:text-brand-fg"
                          >
                            <Plus className="h-2.5 w-2.5" strokeWidth={2} />
                          </button>
                        </div>
                        <span className="text-[13px] font-semibold tabular-nums text-brand-fg">
                          {formatPrice(price)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="border-t border-brand-border bg-brand-bg px-5 pb-6 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] text-brand-muted">
                  Subtotal
                </span>
                <span className="font-display text-2xl font-bold tabular-nums leading-none">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-2 text-[10px] tracking-wide text-brand-muted">
                Taxes and shipping calculated at checkout.
              </p>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 bg-brand-fg text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-bg transition-colors duration-300 hover:bg-brand-accent hover:text-white"
              >
                Checkout
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-2.5 flex h-11 w-full items-center justify-center border border-brand-border text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-fg transition-colors duration-300 hover:border-brand-fg"
              >
                View bag
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
