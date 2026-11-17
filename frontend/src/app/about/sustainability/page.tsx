import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { IMAGES } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Sustainability',
  description:
    'Natural fibres, small runs and a wardrobe built to last. Read Maison Valère’s approach to materials, making and longevity.',
  alternates: { canonical: '/about/sustainability' },
};

const PRINCIPLES = [
  {
    number: '01',
    title: 'Natural fibres only',
    body: 'Silk, wool, cashmere, linen and cotton — materials that can be repaired, re-worn and eventually returned to the earth.',
  },
  {
    number: '02',
    title: 'Small, considered runs',
    body: 'We produce twice a year in limited quantities. Making less means nothing is discounted, destroyed or left unloved.',
  },
  {
    number: '03',
    title: 'Longevity by design',
    body: 'Generous seam allowances, replaceable buttons and linings chosen to outlast the outer cloth. Garments are built to be altered, not replaced.',
  },
  {
    number: '04',
    title: 'Traceable partners',
    body: 'We work with the same family-run mills and ateliers year after year, and we publish where our pieces are made.',
  },
];

const FIGURES = [
  { value: '2', label: 'Collections per year' },
  { value: '94%', label: 'Natural or recycled fibres' },
  { value: '7', label: 'European ateliers' },
  { value: '30', label: 'Day complimentary returns' },
];

export default function SustainabilityPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        {/* Header */}
        <section className="mx-auto max-w-[1440px] px-6 pt-14 lg:px-12 lg:pt-20">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-brand-muted"
          >
            <Link href="/about" className="transition-colors hover:text-brand-fg">
              Our Story
            </Link>
            <span aria-hidden>/</span>
            <span className="text-brand-fg">Sustainability</span>
          </nav>
          <div className="grid gap-8 border-b border-brand-border pb-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-brand-muted">
                <span className="h-px w-8 bg-brand-accent" />
                Our Responsibility
              </p>
              <h1 className="font-display font-bold uppercase text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] text-brand-fg">
                Buy less.
                <br />
                <em className="italic">Wear longer.</em>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-sm leading-7 text-brand-muted">
                Sustainability is not a collection for us. It is the consequence of
                making clothing the slow way — and expecting it to be kept.
              </p>
            </div>
          </div>
        </section>

        {/* Image */}
        <section className="px-6 pt-10 lg:px-12">
          <div className="relative mx-auto aspect-[16/10] max-w-[1440px] overflow-hidden bg-brand-surface">
            <Image
              src={IMAGES.sustainability}
              alt="Natural fabrics and garments in the Maison Valère atelier"
              fill
              priority
              sizes="100vw"
              className="object-cover"
              unoptimized
            />
          </div>
        </section>

        {/* Figures */}
        <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20">
          <dl className="grid grid-cols-2 gap-y-10 border-y border-brand-border py-10 lg:grid-cols-4">
            {FIGURES.map((figure) => (
              <div key={figure.label}>
                <dt className="sr-only">{figure.label}</dt>
                <dd>
                  <span className="block font-display font-semibold uppercase text-4xl text-brand-fg md:text-5xl">
                    {figure.value}
                  </span>
                  <span className="mt-2 block text-[10px] uppercase tracking-[0.18em] text-brand-muted">
                    {figure.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Principles */}
        <section className="mx-auto max-w-[1440px] px-6 pb-20 lg:px-12 lg:pb-28">
          <Reveal>
            <h2 className="max-w-2xl font-display font-bold uppercase text-4xl leading-tight text-brand-fg md:text-5xl">
              Four commitments we can
              <br />
              <em className="italic">actually keep.</em>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2">
            {PRINCIPLES.map((principle, i) => (
              <Reveal key={principle.number} delay={i * 80}>
                <div className="grid grid-cols-[48px_1fr] gap-4 border-t border-brand-fg pt-6">
                  <span className="text-[10px] tabular-nums tracking-[0.2em] text-brand-accent">
                    {principle.number}
                  </span>
                  <div>
                    <h3 className="font-display font-semibold uppercase text-2xl text-brand-fg">
                      {principle.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-brand-muted">
                      {principle.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Repair note */}
        <section className="border-t border-brand-border bg-brand-surface/60">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-20 lg:grid-cols-12 lg:px-12 lg:py-24">
            <div className="lg:col-span-7">
              <p className="mb-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-brand-muted">
                <span className="h-px w-8 bg-brand-accent" />
                Aftercare
              </p>
              <h2 className="font-display font-bold uppercase text-3xl leading-tight text-brand-fg md:text-4xl">
                The most sustainable garment
                <br />
                is the one already in your wardrobe.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-sm leading-7 text-brand-muted">
                Complimentary repairs are offered on all Maison Valère pieces, for as
                long as we exist. Write to our client advisors with a photograph and we
                will advise on mending, re-lining or re-buttoning.
              </p>
              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-fg underline underline-offset-4"
                >
                  Request a repair
                </Link>
                <Link
                  href="/about/craftsmanship"
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-muted transition-colors hover:text-brand-fg"
                >
                  Craftsmanship
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
