'use client';

import { useEffect, useMemo, useState, FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice } from '@/lib/utils';
import { useWishlist } from '@/lib/wishlist-context';
import { Order } from '@/lib/types';

const ORDERS_KEY = 'mv-orders';

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      // Reading browser storage requires a post-mount update.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrders(Array.isArray(stored) ? stored : []);
    } catch {
      setOrders([]);
    }
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return orders.filter(
      (order) =>
        order.order_number.toLowerCase().includes(term) ||
        order.customer_email.toLowerCase().includes(term)
    );
  }, [orders, query]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setSearched(true);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-12 lg:px-12 lg:pt-16">
          <div className="border-b border-brand-border pb-8">
            <p className="mb-3 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-brand-muted">
              <span className="h-px w-6 bg-brand-accent" />
              Client Area
            </p>
            <h1 className="font-display font-bold uppercase text-4xl text-brand-fg md:text-5xl">
              My Account
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-brand-muted">
              Review orders placed in this browser, track a delivery, or find your
              saved pieces. For assistance, our client advisors are available Monday
              to Saturday.
            </p>
          </div>

          <div className="grid gap-14 pt-12 lg:grid-cols-[1fr_320px] lg:gap-20">
            <div>
              {/* Order lookup */}
              <section>
                <h2 className="mb-5 text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                  Find an order
                </h2>
                <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="order-search" className="sr-only">
                    Order number or email
                  </label>
                  <input
                    id="order-search"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSearched(false);
                    }}
                    placeholder="Order number or email address"
                    className="h-12 flex-1 border border-brand-border bg-transparent px-4 text-sm text-brand-fg placeholder:text-brand-muted/70 focus:border-brand-fg focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="h-12 bg-brand-fg px-8 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-accent"
                  >
                    Search
                  </button>
                </form>

                {searched && query.trim() && (
                  <div className="mt-6">
                    {results.length === 0 ? (
                      <p className="text-sm text-brand-muted">
                        No orders matched &ldquo;{query.trim()}&rdquo; in this browser.
                        Demonstration orders are stored locally on the device used to
                        place them.
                      </p>
                    ) : (
                      <ul className="divide-y divide-brand-border border-y border-brand-border">
                        {results.map((order) => (
                          <OrderRow key={order.order_number} order={order} />
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </section>

              {/* Orders */}
              <section className="mt-14">
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <h2 className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                    Order history
                  </h2>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-brand-muted">
                    {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="border border-brand-border px-8 py-12 text-center">
                    <Package className="mx-auto mb-4 h-7 w-7 text-brand-muted" strokeWidth={1} />
                    <p className="font-display font-semibold uppercase text-2xl text-brand-fg">No orders yet</p>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-brand-muted">
                      When you complete a checkout, your order will appear here —
                      stored privately in this browser.
                    </p>
                    <Link
                      href="/shop"
                      className="mt-6 inline-flex items-center gap-3 border border-brand-fg px-7 py-3 text-[10px] uppercase tracking-[0.2em] text-brand-fg transition-colors hover:bg-brand-fg hover:text-white"
                    >
                      Explore the collection
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1} />
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-brand-border border-y border-brand-border">
                    {orders.map((order) => (
                      <OrderRow key={order.order_number} order={order} />
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* Aside */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="border border-brand-border bg-brand-surface/60 p-6">
                <h2 className="font-display font-semibold uppercase text-xl text-brand-fg">Your wishlist</h2>
                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  {wishlistCount > 0
                    ? `${wishlistCount} ${wishlistCount === 1 ? 'piece is' : 'pieces are'} saved in this browser.`
                    : 'Save pieces as you browse to keep them here.'}
                </p>
                <Link
                  href="/wishlist"
                  className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-fg underline underline-offset-4"
                >
                  View wishlist
                </Link>
              </div>

              <div className="mt-6 border border-brand-border p-6">
                <h2 className="mb-4 text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                  Client Services
                </h2>
                <ul className="space-y-3 text-sm text-brand-fg">
                  <li>
                    <Link href="/shipping" className="transition-colors hover:text-brand-accent">
                      Shipping & delivery
                    </Link>
                  </li>
                  <li>
                    <Link href="/returns" className="transition-colors hover:text-brand-accent">
                      Returns & exchanges
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="transition-colors hover:text-brand-accent">
                      Frequently asked questions
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="transition-colors hover:text-brand-accent">
                      Contact an advisor
                    </Link>
                  </li>
                </ul>
              </div>

              <p className="mt-6 text-[10px] leading-5 tracking-wide text-brand-muted">
                Orders are stored locally for this demonstration. No account or
                payment data is held on a server.
              </p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function OrderRow({ order }: { order: Order }) {
  return (
    <li>
      <Link
        href={`/order/${order.order_number}`}
        className="group flex flex-wrap items-center justify-between gap-4 py-5"
      >
        <div>
          <p className="font-display font-semibold uppercase text-xl text-brand-fg transition-colors group-hover:text-brand-accent">
            {order.order_number}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-brand-muted">
            {new Date(order.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}{' '}
            · {order.items.reduce((n, item) => n + item.quantity, 0)}{' '}
            {order.items.reduce((n, item) => n + item.quantity, 0) === 1
              ? 'piece'
              : 'pieces'}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm tabular-nums text-brand-fg">
              {formatPrice(order.total)}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-brand-accent">
              {order.order_status}
            </p>
          </div>
          <ArrowRight
            className="h-4 w-4 text-brand-muted transition-transform duration-500 group-hover:translate-x-1"
            strokeWidth={1}
          />
        </div>
      </Link>
    </li>
  );
}
