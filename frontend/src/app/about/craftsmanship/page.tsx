import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { IMAGES } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Craftsmanship',
  description:
    'Inside the Maison Valère atelier: hand-cutting, three fittings and finishes worked by hand. Discover how our pieces are made in Europe.',
  alternates: { canonical: '/about/craftsmanship' },
};

const STEPS = [
  {
    number: '01',
    title: 'The Pattern',
    body: 'Every silhouette begins as a paper pattern, drafted by hand and refined over weeks. Nothing is digitised until the toile is right.',
  },
  {
    number: '02',
    title: 'The Toile',
    body: 'A first garment is cut in calico, then pinned and re-pinned on the dress form. The toile is where a design earns its proportions.',
  },
  {
    number: '03',
    title: 'The Fittings',
    body: 'Three fittings follow — on the stand, on the body, and finally on a model in movement. A seam is moved by a millimetre and the line changes entirely.',
  },
  {
    number: '04',
    title: 'The Finish',
    body: 'Buttonholes by hand, linings bagged, hems weighted. The final hours are the quietest and the most decisive.',
  },
];

const MATERIALS = [
  { name: 'Silk', origin: 'Como, Italy', note: 'Woven on traditional jacquard looms.' },
  { name: 'Cashmere', origin: 'Scottish Borders', note: 'Brushed, two-ply, spun for drape.' },
  { name: 'Wool', origin: 'Biella, Italy', note: 'Mid-weight flannel and fine worsted.' },
  { name: 'Linen', origin: 'Northern Portugal', note: 'Rain-fed, stone-washed for softness.' },
];

export default function CraftsmanshipPage() {
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
            <span className="text-brand-fg">Craftsmanship</span>
          </nav>
          <div className="grid gap-8 border-b border-brand-border pb-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-brand-muted">
                <span className="h-px w-8 bg-brand-accent" />
                Savoir-Faire
              </p>
              <h1 className="font-display font-bold uppercase text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] text-brand-fg">
                Made by hand,
                <br />
                <em className="italic">slowly.</em>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-sm leading-7 text-brand-muted">
                A Maison Valère garment passes through more than forty pairs of hands
                before it reaches you. This is what those hands do.
              </p>
            </div>
          </div>
        </section>

        {/* Image */}
        <section className="px-6 pt-10 lg:px-12">
          <div className="relative mx-auto aspect-[16/9] max-w-[1440px] overflow-hidden bg-brand-surface">
            <Image
              src={IMAGES.craftsmanship}
              alt="Garments on a rail in the Maison Valère atelier"
              fill
              priority
              sizes="100vw"
              className="object-cover"
              unoptimized
            />
          </div>
        </section>

        {/* Process */}
        <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-28">
          <Reveal>
            <p className="mb-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-brand-muted">
              <span className="h-px w-8 bg-brand-accent" />
              The Process
            </p>
            <h2 className="max-w-2xl font-display font-bold uppercase text-4xl leading-tight text-brand-fg md:text-5xl">
              Four stages. No shortcuts.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.number} delay={i * 90}>
                <div className="border-t border-brand-fg pt-5">
                  <p className="text-[10px] tabular-nums tracking-[0.2em] text-brand-accent">
                    {step.number}
                  </p>
                  <h3 className="mt-4 font-display font-semibold uppercase text-2xl text-brand-fg">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-brand-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Materials */}
        <section className="border-y border-brand-border bg-brand-surface/60">
          <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="mb-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-brand-muted">
                  <span className="h-px w-8 bg-brand-accent" />
                  Materials
                </p>
                <h2 className="font-display font-bold uppercase text-3xl leading-tight text-brand-fg md:text-4xl">
                  Chosen for how
                  <br />
                  they <em className="italic">hold light.</em>
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-brand-muted">
                  We buy from mills we have visited, in quantities we can trace. Nothing
                  is chosen for a label — only for the way it behaves in the hand.
                </p>
              </div>

              <ul className="divide-y divide-brand-border border-y border-brand-border lg:col-span-7 lg:col-start-6">
                {MATERIALS.map((material) => (
                  <li
                    key={material.name}
                    className="grid grid-cols-[1fr_auto] items-baseline gap-6 py-5"
                  >
                    <div>
                      <p className="font-display font-semibold uppercase text-xl text-brand-fg">{material.name}</p>
                      <p className="mt-1 text-xs leading-5 text-brand-muted">
                        {material.note}
                      </p>
                    </div>
                    <p className="text-right text-[10px] uppercase tracking-[0.16em] text-brand-muted">
                      {material.origin}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-24">
          <div className="flex flex-col items-start justify-between gap-8 border-t border-brand-border pt-10 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display font-bold uppercase text-3xl text-brand-fg md:text-4xl">
                See the work in person.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-brand-muted">
                Private appointments are available at the Paris atelier, Monday to
                Saturday.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-brand-fg px-7 py-3.5 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-accent"
              >
                Book an appointment
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1} />
              </Link>
              <Link
                href="/about/sustainability"
                className="inline-flex items-center gap-3 border border-brand-border px-7 py-3.5 text-[10px] uppercase tracking-[0.2em] text-brand-fg transition-colors hover:border-brand-fg"
              >
                Sustainability
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
