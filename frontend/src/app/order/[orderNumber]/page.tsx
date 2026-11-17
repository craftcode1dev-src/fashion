'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, Check, Package } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice } from '@/lib/utils';
import { Order, OrderItem } from '@/lib/types';

const ORDERS_KEY = 'mv-orders';

type StoredOrderItem = OrderItem & { slug?: string };

export default function OrderConfirmationPage() {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = decodeURIComponent(params.orderNumber ?? '');
  const [state, setState] = useState<'loading' | 'found' | 'missing'>('loading');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      const list: Order[] = Array.isArray(stored) ? stored : [];
      const match = list.find((o) => o.order_number === orderNumber);
      if (match) {
        // Browser-only order storage is available after mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrder(match);
        setState('found');
      } else {
        setState('missing');
      }
    } catch {
      setState('missing');
    }
  }, [orderNumber]);

  const firstName = order?.customer_name?.split(' ')[0] ?? '';
  const estimated =
    order?.shipping_method === 'Concierge Delivery'
      ? '2–3 business days'
      : '5–7 business days';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-24">
          {state === 'loading' && (
            <div className="mx-auto max-w-2xl">
              <div className="h-8 w-52 animate-pulse bg-brand-surface" />
              <div className="mt-6 h-40 animate-pulse bg-brand-surface" />
            </div>
          )}

          {state === 'missing' && (
            <div className="mx-auto max-w-xl py-16 text-center">
              <Package className="mx-auto mb-6 h-9 w-9 text-brand-muted" strokeWidth={1} />
              <h1 className="font-display text-4xl font-bold uppercase leading-none text-brand-fg md:text-5xl">
                Order not found
              </h1>
              <p className="mt-4 text-sm leading-7 text-brand-muted">
                We couldn&rsquo;t locate order{' '}
                <span className="text-brand-fg">{orderNumber}</span> in this browser.
                Orders placed through this demonstration are stored locally, so they
                can be reviewed from your account.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/account"
                  className="inline-flex items-center gap-3 bg-brand-fg px-8 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-brand-accent"
                >
                  View my orders
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-3 border border-brand-border px-8 py-4 text-[10px] uppercase tracking-[0.22em] text-brand-fg transition-colors hover:border-brand-fg"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          )}

          {state === 'found' && order && (
            <div className="mx-auto max-w-4xl">
              <div className="border-b border-brand-border pb-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-brand-accent text-brand-accent">
                  <Check className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <p className="mb-3 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-brand-muted">
                  <span className="h-px w-6 bg-brand-accent" />
                  Order Confirmed
                </p>
                <h1 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em] text-brand-fg">
                  Thank you{firstName ? `, ${firstName}` : ''}.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-brand-muted">
                  Your order <span className="text-brand-fg">{order.order_number}</span>{' '}
                  has been received. A confirmation has been prepared for{' '}
                  <span className="text-brand-fg">{order.customer_email}</span>.
                </p>
              </div>

              <div className="grid gap-10 pt-10 lg:grid-cols-[1fr_320px] lg:gap-16">
                {/* Items */}
                <div>
                  <h2 className="mb-5 text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                    Your pieces
                  </h2>
                  <ul className="divide-y divide-brand-border border-y border-brand-border">
                    {(order.items as StoredOrderItem[]).map((item, i) => (
                      <li
                        key={`${item.product_id}-${item.product_variant_id}-${i}`}
                        className="flex items-center gap-5 py-5"
                      >
                        <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-brand-surface">
                          {item.image_url && (
                            <Image
                              src={item.image_url}
                              alt={item.product_name}
                              fill
                              sizes="64px"
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          {item.slug ? (
                            <Link
                              href={`/products/${item.slug}`}
                              className="text-[14px] font-medium text-brand-fg transition-colors hover:text-brand-accent"
                            >
                              {item.product_name}
                            </Link>
                          ) : (
                            <p className="text-[14px] font-medium text-brand-fg">
                              {item.product_name}
                            </p>
                          )}
                          {item.variant_label && (
                            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-brand-muted">
                              {item.variant_label}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-brand-muted">
                            Quantity {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm tabular-nums text-brand-fg">
                          {formatPrice(item.total)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Subtotal</span>
                      <span className="tabular-nums">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Shipping</span>
                      <span className="tabular-nums">
                        {order.shipping_cost === 0
                          ? 'Complimentary'
                          : formatPrice(order.shipping_cost)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-brand-border pt-3">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-brand-fg">
                        Total
                      </span>
                      <span className="font-display text-2xl font-bold tabular-nums leading-none">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <aside className="space-y-8">
                  <div>
                    <h2 className="mb-3 text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                      Delivery
                    </h2>
                    <p className="text-sm leading-6 text-brand-fg">
                      {order.shipping_address}
                      <br />
                      {order.shipping_city} {order.shipping_postal_code}
                      <br />
                      {order.shipping_country}
                    </p>
                    <p className="mt-3 text-xs leading-6 text-brand-muted">
                      {order.shipping_method ?? 'Standard Delivery'}
                      <br />
                      Estimated {estimated}
                    </p>
                  </div>

                  <div>
                    <h2 className="mb-3 text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                      Payment
                    </h2>
                    <p className="text-sm text-brand-fg">
                      {order.payment_method ?? 'Credit / Debit Card'}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-brand-accent">
                      {order.payment_status}
                    </p>
                  </div>

                  <div>
                    <h2 className="mb-3 text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                      Placed
                    </h2>
                    <p className="text-sm text-brand-fg">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="border-t border-brand-border pt-6">
                    <Link
                      href="/shop"
                      className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-brand-fg"
                    >
                      Continue shopping
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                        strokeWidth={1}
                      />
                    </Link>
                  </div>
                </aside>
              </div>

              <div className="mt-14 border-t border-brand-border pt-8 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">
                  A question? Write to us at{' '}
                  <a
                    href="mailto:clients@maisonvalere.com"
                    className="text-brand-fg underline underline-offset-4"
                  >
                    clients@maisonvalere.com
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
