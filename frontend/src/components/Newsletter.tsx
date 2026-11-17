'use client';

import { useState, FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '@/lib/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;

    setStatus('loading');

    // The storefront runs standalone. Only call the optional API when one is
    // configured, then record the subscription locally either way.
    if (process.env.NEXT_PUBLIC_API_URL) {
      await Promise.race([
        subscribeNewsletter(email).catch(() => null),
        new Promise((resolve) => setTimeout(resolve, 1200)),
      ]);
    }

    try {
      const stored = JSON.parse(localStorage.getItem('mv-newsletter') || '[]');
      const list = Array.isArray(stored) ? stored : [];
      if (!list.includes(email.trim())) {
        localStorage.setItem('mv-newsletter', JSON.stringify([...list, email.trim()]));
      }
    } catch {
      // Storage unavailable — still confirm the interaction
    }

    setStatus('success');
    setEmail('');
  }

  return (
    <section className="relative overflow-hidden border-t border-brand-border bg-brand-surface px-5 py-16 lg:px-10 lg:py-24">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 right-0 select-none font-display text-[20vw] font-bold uppercase leading-none text-brand-fg/[0.035] lg:-bottom-14"
      >
        The List
      </span>

      <div className="relative mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <p className="mb-4 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-muted">
            <span className="h-px w-7 bg-brand-accent" />
            The list
          </p>
          <h2 className="font-display text-[clamp(2.8rem,6vw,5.2rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em]">
            First access.
            <br />
            No noise<span className="text-brand-accent">.</span>
          </h2>
          <p className="mt-5 max-w-md text-[13px] leading-6 text-brand-muted">
            New drops, restocks and the occasional studio note. Two emails a
            month, never more.
          </p>
        </div>

        <div className="lg:col-span-5 lg:justify-self-end lg:pb-1">
          {status === 'success' ? (
            <div className="border-t border-brand-fg pt-6">
              <p className="font-display text-3xl font-semibold uppercase leading-none">
                You&rsquo;re on the list.
              </p>
              <p className="mt-3 text-[13px] leading-6 text-brand-muted">
                Watch your inbox for the next drop.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="flex items-center gap-4 border-b border-brand-fg pb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  aria-label="Email address"
                  required
                  className="h-10 w-full bg-transparent text-sm tracking-wide text-brand-fg placeholder:text-brand-muted/70 focus:outline-none"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  aria-label="Subscribe to the Maison Valère list"
                  className="group flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-fg transition-opacity duration-300 hover:opacity-60 disabled:opacity-40"
                >
                  {status === 'loading' ? 'Joining' : 'Subscribe'}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </button>
              </div>
              <p className="mt-4 text-[10px] leading-5 tracking-wide text-brand-muted">
                By subscribing you agree to our Privacy Policy. Unsubscribe at any
                time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
