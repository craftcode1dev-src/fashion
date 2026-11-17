import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description:
    'Complimentary returns within 30 days at Maison Valère. Learn how to arrange a return or exchange, and what to expect from your refund.',
  alternates: { canonical: '/returns' },
};

const STEPS = [
  {
    number: '01',
    title: 'Request a return',
    body: 'Write to clients@maisonvalere.com within 30 days of delivery, including your order number and the piece you wish to return.',
  },
  {
    number: '02',
    title: 'Pack the piece',
    body: 'Refold the garment in its original tissue, place it in the box with all tags attached, and seal the parcel with the provided tape.',
  },
  {
    number: '03',
    title: 'We collect',
    body: 'A courier will collect from your address at a time you choose. Returns are complimentary worldwide — no label to print.',
  },
  {
    number: '04',
    title: 'Refund or exchange',
    body: 'Once inspected in Paris, refunds are issued to the original payment method within five business days. Exchanges are reserved where possible.',
  },
];

const CONDITIONS = [
  'Pieces must be unworn, unwashed and in their original condition.',
  'All original tags, labels and packaging must be attached and included.',
  'Footwear must be tried on a carpeted surface; soles must be unmarked.',
  'Jewellery must be returned in its original box with the authenticity card.',
  'Made-to-measure and altered pieces cannot be returned.',
];

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-14 lg:px-12 lg:pt-20">
          <div className="grid gap-8 border-b border-brand-border pb-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-brand-muted">
                <span className="h-px w-8 bg-brand-accent" />
                Client Services
              </p>
              <h1 className="font-display font-bold uppercase text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] text-brand-fg">
                Returns &
                <br />
                <em className="italic">exchanges.</em>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-sm leading-7 text-brand-muted">
                If a piece is not right, we will collect it. Returns are complimentary
                within 30 days, worldwide.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="grid gap-6 border-b border-brand-border py-8 sm:grid-cols-3">
            {[
              { title: '30 days', note: 'From delivery to request' },
              { title: 'Complimentary', note: 'Collection from your door' },
              { title: '5 business days', note: 'To issue your refund' },
            ].map((item) => (
              <div key={item.title}>
                <p className="font-display font-semibold uppercase text-2xl text-brand-fg">{item.title}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-brand-muted">
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          {/* Steps */}
          <section className="py-16 lg:py-20">
            <h2 className="font-display font-bold uppercase text-3xl text-brand-fg md:text-4xl">
              Four steps
            </h2>
            <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div key={step.number} className="border-t border-brand-fg pt-5">
                  <p className="text-[10px] tabular-nums tracking-[0.2em] text-brand-accent">
                    {step.number}
                  </p>
                  <h3 className="mt-4 font-display font-semibold uppercase text-xl text-brand-fg">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-brand-muted">{step.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Conditions */}
          <section className="grid gap-12 border-t border-brand-border pt-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="font-display font-bold uppercase text-3xl text-brand-fg">
                Condition of return
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-brand-muted">
                To protect the integrity of the collection, pieces are inspected on
                arrival in Paris. The following apply to all returns.
              </p>
            </div>
            <ul className="space-y-4 lg:col-span-7 lg:col-start-6">
              {CONDITIONS.map((condition) => (
                <li key={condition} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent"
                    strokeWidth={1.25}
                  />
                  <span className="text-sm leading-7 text-brand-muted">{condition}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Notes */}
          <section className="mt-16 grid gap-10 border-t border-brand-border pt-12 md:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg">Refunds</h2>
              <p className="mt-4 text-sm leading-7 text-brand-muted">
                Refunds are issued to the original payment method. Duties and taxes are
                included in the refund. Your bank may take a further three to five
                business days to post the credit.
              </p>
            </div>
            <div>
              <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg">Faulty pieces</h2>
              <p className="mt-4 text-sm leading-7 text-brand-muted">
                Every piece is inspected before dispatch. If something has been missed,
                contact us within 14 days with a photograph and we will arrange a
                replacement, repair or refund — whichever you prefer.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-brand-border pt-10 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display font-bold uppercase text-2xl text-brand-fg md:text-3xl">
                Begin a return
              </h2>
              <p className="mt-2 text-sm text-brand-muted">
                Include your order number and the piece you wish to return.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:clients@maisonvalere.com?subject=Return%20request"
                className="inline-flex items-center gap-3 bg-brand-fg px-7 py-3.5 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-accent"
              >
                Email client care
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1} />
              </a>
              <Link
                href="/faq"
                className="inline-flex items-center gap-3 border border-brand-border px-7 py-3.5 text-[10px] uppercase tracking-[0.2em] text-brand-fg transition-colors hover:border-brand-fg"
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
