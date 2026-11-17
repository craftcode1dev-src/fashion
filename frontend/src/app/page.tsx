import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MoveDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';
import Reveal from '@/components/Reveal';
import {
  HOME_COLLECTIONS,
  IMAGES,
  getBestsellers,
  getCollectionProducts,
  getNewArrivals,
} from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Maison Valère — Contemporary Workwear & Essentials',
  description:
    'Workwear proportions, Parisian cut. Discover Autumn / Winter 2026 from Maison Valère: rigid denim, heavyweight fleece, honest outerwear and everyday essentials, made in Europe.',
  alternates: { canonical: '/' },
};

const TICKER_ITEMS = [
  'Workwear, re-cut',
  'Made in Europe',
  'Built to be worn in',
  'Free shipping over €250',
  'New season — AW26',
  'Free returns within 30 days',
];

function CollectionTile({
  collection,
  count,
  className = '',
  sizes,
}: {
  collection: (typeof HOME_COLLECTIONS)[number];
  count: number;
  className?: string;
  sizes: string;
}) {
  return (
    <Link
      href={collection.href}
      className={`group relative block overflow-hidden bg-brand-surface ${className}`}
    >
      <Image
        src={collection.image}
        alt={collection.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        unoptimized
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5 transition-opacity duration-500 group-hover:from-black/80" />
      <span className="absolute left-5 top-5 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.22em] text-white/70">
        <span className="h-px w-5 bg-white/50" />
        {collection.index}
      </span>
      <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-brand-fg">
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <span className="absolute inset-x-5 bottom-5">
        <span className="block font-display text-[clamp(1.9rem,4vw,3.5rem)] font-semibold uppercase leading-[0.9] text-white">
          {collection.name}
        </span>
        <span className="mt-2 flex items-center justify-between gap-4 border-t border-white/25 pt-2.5 text-[9px] uppercase tracking-[0.16em] text-white/65">
          <span>{collection.tagline}</span>
          <span className="tabular-nums">{String(count).padStart(2, '0')} pcs</span>
        </span>
      </span>
    </Link>
  );
}

export default function HomePage() {
  const arrivals = getNewArrivals().slice(0, 8);
  const bestsellers = getBestsellers().slice(0, 4);

  return (
    <>
      <Header overlay />
      <main>
        {/* ── 1 · Campaign hero ─────────────────────────────── */}
        <section className="relative h-svh min-h-[660px] overflow-hidden bg-brand-charcoal">
          <Image
            src={IMAGES.hero}
            alt="Maison Valère Autumn Winter 2026 campaign — utility layering"
            fill
            priority
            sizes="100vw"
            className="animate-[kenburns_18s_ease-out_both] object-cover object-[50%_30%]"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

          <p className="absolute left-5 top-1/2 hidden -translate-y-1/2 rotate-180 text-[9px] uppercase tracking-[0.42em] text-white/45 [writing-mode:vertical-rl] xl:left-9 xl:block">
            Maison Valère — Paris — Autumn / Winter 2026
          </p>

          <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-16 lg:px-10 lg:pb-20">
            <div className="mx-auto w-full max-w-[1600px]">
              <p
                className="mb-5 flex animate-[fade-up_900ms_cubic-bezier(0.22,1,0.36,1)_both] items-center gap-3 text-[9px] font-medium uppercase tracking-[0.3em] text-white/70 sm:text-[10px]"
                style={{ animationDelay: '120ms' }}
              >
                <span className="h-px w-9 bg-brand-accent" />
                Collection 07 — The Everyday, Elevated
              </p>

              <h1
                className="max-w-[15ch] animate-[fade-up_1100ms_cubic-bezier(0.22,1,0.36,1)_both] font-display text-[clamp(4.4rem,13vw,11.5rem)] font-bold uppercase leading-[0.8] tracking-[-0.02em] text-white"
                style={{ animationDelay: '240ms' }}
              >
                Utility,
                <br />
                refined<span className="text-brand-accent">.</span>
              </h1>

              <div
                className="mt-8 flex animate-[fade-up_1100ms_cubic-bezier(0.22,1,0.36,1)_both] flex-col gap-7 border-t border-white/25 pt-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12 lg:mt-10"
                style={{ animationDelay: '420ms' }}
              >
                <p className="max-w-sm text-[13px] leading-6 text-white/75">
                  Workwear proportions, Parisian cut. Rigid denim, heavyweight
                  fleece and honest outerwear — built to be worn in, not saved for
                  later.
                </p>

                <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                  <Link
                    href="/collections/new-arrivals"
                    className=" group inline-flex h-12 items-center gap-3 bg-white px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-fg transition-colors hover:bg-brand-accent hover:text-white"
                  >
                    Shop new arrivals
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </Link>
                  <Link
                    href="/shop"
                    className="link-underline text-[10px] font-medium uppercase tracking-[0.18em] text-white/85 transition-colors hover:text-white"
                  >
                    Explore the collection
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 sm:flex">
            <MoveDown className="h-3.5 w-3.5" strokeWidth={1.2} />
            <span className="relative block h-8 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-0 animate-[scroll-cue_2.4s_ease-in-out_infinite] bg-white/70" />
            </span>
          </div>
        </section>

        {/* ── 2 · Ticker ────────────────────────────────────── */}
        <section
          aria-hidden="true"
          className="overflow-hidden border-b border-brand-border bg-brand-fg py-3.5 text-brand-bg"
        >
          <div className="flex w-max animate-[marquee_38s_linear_infinite] hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {TICKER_ITEMS.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="flex items-center whitespace-nowrap font-display text-[15px] font-medium uppercase tracking-[0.14em]"
                  >
                    <span className="px-7">{item}</span>
                    <span className="h-1 w-1 rounded-full bg-brand-accent" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── 3 · New arrivals ──────────────────────────────── */}
        <section className="bg-brand-bg px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[1600px]">
            <Reveal>
              <div className="mb-10 flex flex-col gap-6 border-b border-brand-border pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-4 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-muted">
                    <span className="h-px w-7 bg-brand-accent" />
                    Just landed
                  </p>
                  <h2 className="font-display text-[clamp(3.2rem,7.5vw,6.5rem)] font-bold uppercase leading-[0.82] tracking-[-0.015em]">
                    New arrivals
                    <sup className="ml-2 align-super font-sans text-[10px] font-medium tracking-[0.16em] text-brand-muted">
                      ({String(arrivals.length).padStart(2, '0')})
                    </sup>
                  </h2>
                </div>
                <Link
                  href="/collections/new-arrivals"
                  className="group inline-flex items-center gap-3 self-start text-[10px] font-semibold uppercase tracking-[0.18em] sm:self-auto"
                >
                  <span className="border-b border-brand-fg pb-1 transition-colors group-hover:border-brand-accent group-hover:text-brand-accent">
                    View all
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
              {arrivals.map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 80}>
                  <ProductCard
                    product={product}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4 · Featured edits ────────────────────────────── */}
        <section className="border-y border-brand-border bg-brand-surface px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[1600px]">
            <Reveal>
              <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">
                  <p className="mb-4 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-muted">
                    <span className="h-px w-7 bg-brand-accent" />
                    Curated edits
                  </p>
                  <h2 className="font-display text-[clamp(3.2rem,7vw,6rem)] font-bold uppercase leading-[0.82] tracking-[-0.015em]">
                    Five ways to
                    <br />
                    wear the season
                  </h2>
                </div>
                <p className="max-w-xs text-[13px] leading-6 text-brand-muted lg:col-span-4 lg:col-start-9 lg:justify-self-end">
                  Start with a category, build a uniform. Every edit is made from
                  the same small set of honest materials.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4">
              <Reveal className="sm:col-span-2 lg:col-span-7">
                <CollectionTile
                  collection={HOME_COLLECTIONS[0]}
                  count={getCollectionProducts(HOME_COLLECTIONS[0].slug).length}
                  className="aspect-[4/3] lg:aspect-[5/4]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </Reveal>
              <Reveal className="lg:col-span-5" delay={100}>
                <CollectionTile
                  collection={HOME_COLLECTIONS[1]}
                  count={getCollectionProducts(HOME_COLLECTIONS[1].slug).length}
                  className="aspect-[4/5]"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </Reveal>

              {HOME_COLLECTIONS.slice(2).map((collection, i) => (
                <Reveal
                  key={collection.slug}
                  className="lg:col-span-4"
                  delay={i * 90}
                >
                  <CollectionTile
                    collection={collection}
                    count={getCollectionProducts(collection.slug).length}
                    className="aspect-[3/4] lg:aspect-[4/5]"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5 · Editorial ─────────────────────────────────── */}
        <section className="bg-brand-charcoal text-brand-bg">
          <div className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-12">
            <Reveal className="relative min-h-[460px] overflow-hidden lg:col-span-7 lg:min-h-[720px]">
              <Image
                src={IMAGES.editorial}
                alt="The winter uniform editorial — pale blue coat in Milan"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-[50%_28%]"
                unoptimized
              />
              <span className="absolute left-5 top-5 bg-brand-bg px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-brand-fg">
                Editorial — AW26
              </span>
              <span className="absolute bottom-5 right-5 text-[9px] uppercase tracking-[0.18em] text-white/60">
                Milan, 07:42
              </span>
            </Reveal>

            <div className="flex items-center px-5 py-16 lg:col-span-5 lg:px-12 lg:py-20 xl:px-16">
              <Reveal>
                <p className="mb-5 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.3em] text-brand-bg/45">
                  <span className="h-px w-7 bg-brand-accent" />
                  The winter uniform
                </p>
                <h2 className="font-display text-[clamp(3rem,6vw,5.4rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em]">
                  One coat.
                  <br />
                  Everything
                  <br />
                  underneath<span className="text-brand-accent">.</span>
                </h2>
                <p className="mt-7 max-w-md text-[13px] leading-6 text-brand-bg/65">
                  The season is built around layering: a long coat over a hoodie, a
                  trucker over a tee, rigid denim under everything. Fewer pieces,
                  worn more often, made to hold their shape.
                </p>

                <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-6">
                  {[
                    { term: 'Layer 01', detail: 'Longline wool' },
                    { term: 'Layer 02', detail: 'Heavy fleece' },
                    { term: 'Layer 03', detail: 'Rigid denim' },
                    { term: 'Layer 04', detail: 'Worn daily' },
                  ].map((row) => (
                    <div key={row.term}>
                      <dt className="text-[8px] uppercase tracking-[0.2em] text-brand-bg/40">
                        {row.term}
                      </dt>
                      <dd className="mt-1 font-display text-xl font-semibold uppercase leading-none">
                        {row.detail}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <Link
                    href="/collections/essential-outerwear"
                    className="group inline-flex h-11 items-center gap-3 bg-brand-bg px-6 text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-fg transition-colors hover:bg-brand-accent hover:text-white"
                  >
                    Shop outerwear
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </Link>
                  <Link
                    href="/collections/denim-trousers"
                    className="link-underline text-[9px] font-medium uppercase tracking-[0.18em] text-brand-bg/70 transition-colors hover:text-brand-bg"
                  >
                    The denim edit
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── 6 · Best sellers ──────────────────────────────── */}
        <section className="grain relative overflow-hidden bg-brand-charcoal px-5 py-20 text-brand-bg lg:px-10 lg:py-28">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 select-none font-display text-[22vw] font-bold uppercase leading-none text-white/[0.035]"
          >
            Icons
          </span>

          <div className="relative mx-auto max-w-[1600px]">
            <Reveal>
              <div className="mb-12 flex flex-col gap-6 border-b border-white/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-4 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-bg/45">
                    <span className="h-px w-7 bg-brand-accent" />
                    Most wanted
                  </p>
                  <h2 className="font-display text-[clamp(3.2rem,7.5vw,6.5rem)] font-bold uppercase leading-[0.82] tracking-[-0.015em]">
                    Best sellers
                  </h2>
                </div>
                <div className="flex items-end gap-8">
                  <p className="hidden max-w-[220px] text-[12px] leading-5 text-brand-bg/50 md:block">
                    The pieces our customers come back for. Tried, worn and still
                    standing.
                  </p>
                  <Link
                    href="/collections/best-sellers"
                    className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em]"
                  >
                    <span className="border-b border-brand-bg/60 pb-1 transition-colors group-hover:border-brand-accent group-hover:text-brand-accent">
                      Shop all
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </Link>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
              {bestsellers.map((product, i) => (
                <Reveal key={product.id} delay={i * 90}>
                  <div className="relative">
                    <span className="mb-2 block font-display text-[11px] font-medium tracking-[0.16em] text-brand-bg/35">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <ProductCard
                      product={product}
                      tone="dark"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7 · Brand story ───────────────────────────────── */}
        <section className="bg-brand-bg px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-[1600px] items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <Reveal className="relative lg:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-surface">
                <Image
                  src={IMAGES.story}
                  alt="Garments on the rail in the Maison Valère studio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-10 right-0 hidden aspect-square w-[42%] overflow-hidden border-[10px] border-brand-bg sm:block lg:-bottom-12 lg:-right-6">
                <Image
                  src={IMAGES.storyDetail}
                  alt="Atelier detail — Maison Valère"
                  fill
                  sizes="25vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute -left-2 top-6 hidden -rotate-90 items-center gap-2 bg-brand-fg px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-brand-bg lg:flex">
                Est. Paris 2010
              </div>
            </Reveal>

            <div className="lg:col-span-5 lg:col-start-8">
              <Reveal>
                <p className="mb-4 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-muted">
                  <span className="h-px w-7 bg-brand-accent" />
                  The house
                </p>
                <h2 className="font-display text-[clamp(3rem,6vw,5.4rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em]">
                  Built, not
                  <br />
                  trended<span className="text-brand-accent">.</span>
                </h2>
              </Reveal>

              <Reveal delay={100}>
                <div className="mt-7 space-y-4 text-[13px] leading-6 text-brand-muted">
                  <p>
                    Maison Valère began in a small Paris studio with a simple idea:
                    take the pieces people actually live in — the work jacket, the
                    hoodie, the straight jean — and cut them properly.
                  </p>
                  <p>
                    We work with a short list of European mills and factories, keep
                    the fabric heavy, and skip the parts that do not last. The
                    result is a wardrobe that gets better with wear, not one that
                    needs replacing every season.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={180}>
                <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-brand-border pt-7">
                  {[
                    { term: 'Founded', detail: 'Paris, 2010' },
                    { term: 'Made in', detail: 'Europe' },
                    { term: 'The line', detail: '37 pieces' },
                    { term: 'Returns', detail: '30 days' },
                  ].map((row) => (
                    <div key={row.term}>
                      <dt className="text-[8px] uppercase tracking-[0.2em] text-brand-muted">
                        {row.term}
                      </dt>
                      <dd className="mt-1 font-display text-2xl font-semibold uppercase leading-none">
                        {row.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={240}>
                <Link
                  href="/about"
                  className="group mt-9 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em]"
                >
                  <span className="border-b border-brand-fg pb-1 transition-colors group-hover:border-brand-accent group-hover:text-brand-accent">
                    Our story
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
