import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import Newsletter from '@/components/Newsletter';
import {
  COLLECTIONS,
  getCollectionProducts,
  type CollectionMeta,
} from '@/lib/catalog';

interface PageProps {
  params: Promise<{ gender: string }>;
}

const COLLECTION_ORDER = [
  'men',
  'women',
  'accessories',
  'new-arrivals',
  'best-sellers',
  'sale',
  'new-season',
  'essential-outerwear',
  'everyday-uniform',
  'denim-trousers',
  'graphic-tees',
];

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ gender: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gender } = await params;
  const collection = COLLECTIONS[gender];
  if (!collection) return { title: 'Collection Not Found' };
  return {
    title: collection.title,
    description: collection.statement,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.title} — Maison Valère`,
      description: collection.statement,
      images: [collection.image],
    },
  };
}

function collectionList(): CollectionMeta[] {
  return COLLECTION_ORDER.map((slug) => COLLECTIONS[slug]).filter(Boolean);
}

export default async function CollectionPage({ params }: PageProps) {
  const { gender } = await params;
  const collection = COLLECTIONS[gender];

  if (!collection) notFound();

  const products = getCollectionProducts(gender);
  const links = collectionList();
  const isEdit = collection.kind === 'edit';
  const relatedEdits = links.filter(
    (c) => c.kind === 'edit' && c.slug !== collection.slug
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        {/* Collection hero */}
        <section className="relative h-[68vh] min-h-[480px] overflow-hidden bg-brand-charcoal">
          <Image
            src={collection.image}
            alt={collection.alt}
            fill
            priority
            sizes="100vw"
            className="animate-[kenburns_12s_ease-out_both] object-cover object-[50%_28%]"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-10 lg:px-10 lg:pb-14">
            <p className="mb-4 flex animate-[fade-up_800ms_cubic-bezier(0.22,1,0.36,1)_both] items-center gap-3 text-[9px] font-medium uppercase tracking-[0.32em] text-white/70">
              <span className="h-px w-8 bg-brand-accent" />
              {collection.eyebrow}
            </p>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
              <h1
                className="animate-[fade-up_1000ms_cubic-bezier(0.22,1,0.36,1)_both] font-display text-[clamp(3.6rem,11vw,9rem)] font-bold uppercase leading-[0.8] tracking-[-0.02em] text-white"
                style={{ animationDelay: '120ms' }}
              >
                {collection.title}
                <span className="text-brand-accent">.</span>
              </h1>
              <div
                className="max-w-sm animate-[fade-up_1000ms_cubic-bezier(0.22,1,0.36,1)_both] sm:pb-2"
                style={{ animationDelay: '280ms' }}
              >
                <p className="text-[13px] leading-6 text-white/75">
                  {collection.statement}
                </p>
                <p className="mt-4 flex items-center gap-3 border-t border-white/25 pt-3 text-[9px] uppercase tracking-[0.2em] text-white/55">
                  <span className="tabular-nums">
                    {String(products.length).padStart(2, '0')} pieces
                  </span>
                  <span className="h-1 w-1 rounded-full bg-brand-accent" />
                  <span>AW26</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Collection switch */}
        <div className="sticky top-[100px] z-30 border-b border-brand-border bg-brand-bg/95 backdrop-blur-xl lg:top-[110px]">
          <div className="mx-auto flex max-w-[1600px] items-center gap-6 overflow-x-auto px-5 py-4 no-scrollbar lg:gap-8 lg:px-10">
            {links.map((link) => {
              const active = link.slug === collection.slug;
              return (
                <Link
                  key={link.slug}
                  href={`/collections/${link.slug}`}
                  data-active={active}
                  className={`link-underline whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    active
                      ? 'text-brand-fg'
                      : link.slug === 'sale'
                        ? 'text-brand-accent/80 hover:text-brand-accent'
                        : 'text-brand-muted hover:text-brand-fg'
                  }`}
                >
                  {link.title}
                </Link>
              );
            })}
            <Link
              href="/shop"
              className="ml-auto hidden shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-fg transition-colors hover:text-brand-accent sm:flex"
            >
              Shop all
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        {/* Pieces */}
        <section id="pieces" className="scroll-mt-40 px-5 py-14 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-brand-border pb-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-brand-muted">
                {products.length} {products.length === 1 ? 'piece' : 'pieces'}
                {isEdit && <span className="ml-2 text-brand-fg">— curated edit</span>}
              </p>
              <p className="hidden text-[10px] uppercase tracking-[0.18em] text-brand-muted sm:block">
                Sorted by featured
              </p>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
                {products.map((product, i) => (
                  <Reveal key={product.id} delay={(i % 4) * 80}>
                    <ProductCard
                      product={product}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="py-20">
                <p className="font-display text-4xl font-semibold uppercase leading-none">
                  This edit is being prepared.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex h-11 items-center gap-3 bg-brand-fg px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-bg transition-colors hover:bg-brand-accent hover:text-white"
                >
                  Explore all pieces
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Related edits */}
        {relatedEdits.length > 0 && (
          <section className="border-y border-brand-border bg-brand-surface px-5 py-14 lg:px-10 lg:py-20">
            <div className="mx-auto max-w-[1600px]">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-3 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-muted">
                    <span className="h-px w-7 bg-brand-accent" />
                    Keep looking
                  </p>
                  <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em]">
                    Other edits
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
                >
                  Shop all
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.5}
                  />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                {relatedEdits.slice(0, 4).map((edit) => (
                  <Link
                    key={edit.slug}
                    href={`/collections/${edit.slug}`}
                    className="group relative block aspect-[4/5] overflow-hidden bg-brand-charcoal"
                  >
                    <Image
                      src={edit.image}
                      alt={edit.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      unoptimized
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <span className="absolute inset-x-4 bottom-4">
                      <span className="block text-[8px] uppercase tracking-[0.2em] text-white/60">
                        {edit.eyebrow}
                      </span>
                      <span className="mt-1 block font-display text-2xl font-semibold uppercase leading-none text-white">
                        {edit.title}
                      </span>
                    </span>
                    <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-500 group-hover:bg-white group-hover:text-brand-fg">
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Closing note */}
        <section className="px-5 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-4 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-muted">
                <span className="h-px w-7 bg-brand-accent" />
                The house
              </p>
              <h2 className="font-display text-[clamp(2.6rem,5.5vw,4.8rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em]">
                Small runs.
                <br />
                Nothing
                <br />
                repeated<span className="text-brand-accent">.</span>
              </h2>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-[13px] leading-6 text-brand-muted">
                Every piece is produced in small quantities with European mills
                and factories. When it is gone, it is gone — the way clothing
                used to be.
              </p>
              <Link
                href="/about/craftsmanship"
                className="group mt-6 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-fg"
              >
                <span className="border-b border-brand-fg pb-1 transition-colors group-hover:border-brand-accent group-hover:text-brand-accent">
                  Our craftsmanship
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
