import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import Reveal from '@/components/Reveal';
import { IMAGES } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'Founded in Paris in 2010, Maison Valère re-cuts the workwear wardrobe: rigid denim, heavyweight fleece and honest outerwear, made in Europe to be worn in.',
  alternates: { canonical: '/about' },
};

const VALUES = [
  {
    title: 'Heavy materials',
    description:
      'We buy fabric by weight, not by margin. 480 gsm fleece, 13.5 oz selvedge denim, garment-dyed cotton twill — the kind of cloth that holds a shape and softens with wear.',
  },
  {
    title: 'Fewer, better',
    description:
      'A line of thirty-seven pieces, released in small runs. No seasonal churn, no logo drops. When something works, we keep making it — and only change what earns the change.',
  },
  {
    title: 'Made in Europe',
    description:
      'Our mills and factories sit in Portugal, Italy and France. Long relationships, fair conditions, short supply chains. We can name the people who made every piece.',
  },
];

const FACTS = [
  { term: 'Founded', detail: 'Paris, 2010' },
  { term: 'Made in', detail: 'Europe' },
  { term: 'The line', detail: '37 pieces' },
  { term: 'Returns', detail: '30 days' },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative flex h-[82vh] min-h-[540px] items-end overflow-hidden bg-brand-charcoal">
        <Image
          src={IMAGES.aboutHero}
          alt="Maison Valère — the studio in Paris"
          fill
          priority
          sizes="100vw"
          className="animate-[kenburns_14s_ease-out_both] object-cover object-[50%_35%]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/25" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-12 lg:px-10 lg:pb-16">
          <p className="mb-4 flex animate-[fade-up_800ms_cubic-bezier(0.22,1,0.36,1)_both] items-center gap-3 text-[9px] font-medium uppercase tracking-[0.32em] text-white/65">
            <span className="h-px w-8 bg-brand-accent" />
            Maison Valère — Paris
          </p>
          <h1
            className="animate-[fade-up_1000ms_cubic-bezier(0.22,1,0.36,1)_both] font-display text-[clamp(3.6rem,12vw,10rem)] font-bold uppercase leading-[0.8] tracking-[-0.02em] text-white"
            style={{ animationDelay: '120ms' }}
          >
            Built, not
            <br />
            trended<span className="text-brand-accent">.</span>
          </h1>
          <p className="mt-5 max-w-md text-[13px] leading-6 text-white/70">
            Workwear proportions, Parisian cut. A small line of honest clothes,
            designed to be worn in — not saved for later.
          </p>
        </div>
      </section>

      <main className="bg-brand-bg">
        {/* Brand story */}
        <section className="mx-auto max-w-[1600px] px-5 py-16 lg:px-10 lg:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-6">
              <p className="mb-4 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-muted">
                <span className="h-px w-7 bg-brand-accent" />
                Founded 2010
              </p>
              <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em]">
                The pieces
                <br />
                people live in,
                <br />
                cut properly<span className="text-brand-accent">.</span>
              </h2>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-5 lg:col-start-8 lg:pt-2">
              <div className="space-y-4 text-[13px] leading-6 text-brand-muted">
                <p>
                  Maison Valère began in a small Paris studio with a simple
                  frustration: the clothes people actually wear were being made
                  badly. The work jacket had gone flimsy. The hoodie had lost its
                  weight. The straight jean had been stretched into something that
                  no longer held a line.
                </p>
                <p>
                  So we started with those pieces — the work jacket, the hoodie,
                  the straight jean — and re-cut them. A little more room through
                  the body. A heavier cloth. A cleaner finish. Nothing that shouts,
                  everything that lasts.
                </p>
                <p>
                  Fifteen years on, the idea has not changed. We still work with a
                  short list of European mills, still keep the fabric heavy, and
                  still skip the parts that do not last.
                </p>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-brand-border pt-6">
                {FACTS.map((fact) => (
                  <div key={fact.term}>
                    <dt className="text-[8px] uppercase tracking-[0.2em] text-brand-muted">
                      {fact.term}
                    </dt>
                    <dd className="mt-1 font-display text-2xl font-semibold uppercase leading-none">
                      {fact.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Values */}
        <section className="border-y border-brand-border bg-brand-surface px-5 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[1600px]">
            <Reveal>
              <p className="mb-4 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-muted">
                <span className="h-px w-7 bg-brand-accent" />
                What we stand on
              </p>
              <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em]">
                Three rules.
                <br />
                No exceptions<span className="text-brand-accent">.</span>
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-8">
              {VALUES.map((value, i) => (
                <Reveal key={value.title} delay={i * 100}>
                  <div className="border-t border-brand-fg pt-5">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="font-display text-3xl font-bold tabular-nums leading-none text-brand-accent">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold uppercase leading-none">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-[13px] leading-6 text-brand-muted">
                      {value.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Studio */}
        <section className="mx-auto max-w-[1600px] px-5 py-16 lg:px-10 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-surface">
                <Image
                  src={IMAGES.aboutAtelier}
                  alt="Inside the Maison Valère studio in Paris"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute bottom-4 left-4 bg-brand-bg px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-brand-fg">
                  Paris 4ᵉ
                </span>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-5 lg:col-start-8">
              <p className="mb-4 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-muted">
                <span className="h-px w-7 bg-brand-accent" />
                The studio
              </p>
              <h2 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em]">
                Cut in Paris.
                <br />
                Sewn in
                <br />
                Europe<span className="text-brand-accent">.</span>
              </h2>
              <div className="mt-6 space-y-4 text-[13px] leading-6 text-brand-muted">
                <p>
                  The studio sits in the fourth arrondissement — a working room
                  with a long cutting table, a rail of samples, and the light
                  that Paris is famous for.
                </p>
                <p>
                  Patterns are cut here and fitted three times before production
                  starts. The sewing happens in family-run factories in Porto and
                  northern Italy that we have worked with for over a decade.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-fg"
                >
                  <span className="border-b border-brand-fg pb-0.5 transition-colors group-hover:border-brand-accent group-hover:text-brand-accent">
                    Get in touch
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Link>
                <Link
                  href="/about/craftsmanship"
                  className="inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-muted transition-colors hover:text-brand-fg"
                >
                  Our craftsmanship
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Quote */}
        <section className="grain relative overflow-hidden bg-brand-charcoal px-5 py-20 text-brand-bg lg:px-10 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <p className="mb-6 text-[9px] uppercase tracking-[0.3em] text-brand-bg/40">
                The point of view
              </p>
              <blockquote className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold uppercase leading-[0.92] tracking-[-0.01em]">
                &ldquo;A garment should feel like a decision — not a trend you
                follow, but a thing you chose.&rdquo;
              </blockquote>
              <p className="mt-7 text-[10px] uppercase tracking-[0.2em] text-brand-bg/50">
                — Isabelle Valère, Founder
              </p>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-bg px-5 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-brand-muted">
                <span className="h-px w-7 bg-brand-accent" />
                The collection
              </p>
              <h2 className="font-display text-[clamp(2.8rem,7vw,6rem)] font-bold uppercase leading-[0.82] tracking-[-0.015em]">
                See the
                <br />
                work<span className="text-brand-accent">.</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/collections/men"
                className="inline-flex h-12 items-center gap-2.5 bg-brand-fg px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-bg transition-colors hover:bg-brand-accent hover:text-white"
              >
                Men
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
              <Link
                href="/collections/women"
                className="inline-flex h-12 items-center gap-2.5 border border-brand-fg px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-fg transition-colors hover:bg-brand-fg hover:text-brand-bg"
              >
                Women
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
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
