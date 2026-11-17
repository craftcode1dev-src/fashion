import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Answers from Maison Valère on orders, shipping, returns, sizing, garment care and private appointments.',
  alternates: { canonical: '/faq' },
};

const SECTIONS = [
  {
    title: 'Orders & Payment',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Select your size and colour on a product page, add the piece to your bag, and continue to checkout. The checkout is a demonstration — no payment is taken and no card details are transmitted.',
      },
      {
        q: 'Which payment methods do you accept?',
        a: 'In our full boutique we accept Visa, Mastercard, American Express, Apple Pay and Pay Later by invoice. The demonstration checkout records your order locally in this browser.',
      },
      {
        q: 'Can I amend or cancel an order?',
        a: 'Orders may be amended before dispatch. Write to clients@maisonvalere.com with your order number and we will do our best to help.',
      },
    ],
  },
  {
    title: 'Shipping',
    items: [
      {
        q: 'When will my order be dispatched?',
        a: 'Orders are prepared by hand in Paris and dispatched within one business day. Standard delivery takes 5–7 business days; concierge delivery arrives in 2–3.',
      },
      {
        q: 'Is shipping complimentary?',
        a: 'Standard shipping is free on all orders over €250. Below that, a flat rate of €35 applies. Concierge delivery is €75 worldwide.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'We ship to Europe, the United Kingdom, the United States, Canada, Australia, Japan and most of the Middle East. Duties and taxes are included at checkout.',
      },
      {
        q: 'How can I track my order?',
        a: 'A tracking link is sent by email once your parcel leaves the atelier. You can also review your order from the account area in this browser.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your returns policy?',
        a: 'Returns are complimentary within 30 days of delivery. Pieces must be unworn, in their original condition, with all tags attached.',
      },
      {
        q: 'How do I arrange a return?',
        a: 'Write to clients@maisonvalere.com with your order number. We will send a prepaid label and arrange collection from your address.',
      },
      {
        q: 'Can I exchange a piece?',
        a: 'Yes. Exchanges for another size or colour are subject to availability. Indicate your preference when requesting the return and we will reserve the replacement where possible.',
      },
    ],
  },
  {
    title: 'Sizing & Care',
    items: [
      {
        q: 'How do I find my size?',
        a: 'Each product page lists the fit notes and the model’s measurements. If you are between sizes, our advisors are happy to compare measurements for you — write to clients@maisonvalere.com.',
      },
      {
        q: 'How should I care for my pieces?',
        a: 'Care instructions are listed on every product page and on the garment label. In general, wash less, air between wears, and store knitwear folded rather than hung.',
      },
      {
        q: 'Do you offer repairs?',
        a: 'Complimentary repairs are offered on all Maison Valère pieces for as long as the house exists. Send a photograph to our client advisors and we will advise.',
      },
    ],
  },
  {
    title: 'Appointments & Accounts',
    items: [
      {
        q: 'Can I visit the atelier?',
        a: 'Private appointments are available Monday to Saturday at 24 Rue de la Paix, Paris. Request a time through the contact page and an advisor will confirm.',
      },
      {
        q: 'Do I need an account to order?',
        a: 'No. You can check out as a guest. This demonstration stores orders and wishlists locally in your browser rather than on a server.',
      },
      {
        q: 'Where is my wishlist saved?',
        a: 'Your wishlist is kept in this browser. It will remain available until you clear your browser data or choose to clear the list.',
      },
    ],
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
        />
        <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-14 lg:px-12 lg:pt-20">
          <div className="grid gap-8 border-b border-brand-border pb-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-brand-muted">
                <span className="h-px w-8 bg-brand-accent" />
                Client Services
              </p>
              <h1 className="font-display font-bold uppercase text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] text-brand-fg">
                Questions,
                <br />
                <em className="italic">answered.</em>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-sm leading-7 text-brand-muted">
                Everything on ordering, delivery, returns and care. If your question
                is not here, our advisors reply within one business day.
              </p>
            </div>
          </div>

          <div className="grid gap-14 pt-12 lg:grid-cols-12 lg:gap-16">
            {/* Index */}
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-32">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                  On this page
                </p>
                <ul className="mt-4 space-y-2.5">
                  {SECTIONS.map((section) => (
                    <li key={section.title}>
                      <a
                        href={`#${section.title.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                        className="text-sm text-brand-fg transition-colors hover:text-brand-accent"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-brand-fg underline underline-offset-4"
                >
                  Contact an advisor
                </Link>
              </div>
            </aside>

            {/* Questions */}
            <div className="lg:col-span-8 lg:col-start-5">
              {SECTIONS.map((section) => {
                const id = section.title.toLowerCase().replace(/[^a-z]+/g, '-');
                return (
                  <section key={section.title} id={id} className="scroll-mt-32 pb-14">
                    <h2 className="mb-4 border-b border-brand-fg pb-4 font-display font-semibold uppercase text-2xl text-brand-fg md:text-3xl">
                      {section.title}
                    </h2>
                    <div className="divide-y divide-brand-border">
                      {section.items.map((item) => (
                        <details key={item.q} className="group py-5">
                          <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 text-[15px] text-brand-fg [&::-webkit-details-marker]:hidden">
                            <span className="font-display font-semibold uppercase text-xl leading-snug">
                              {item.q}
                            </span>
                            <span className="relative mt-2 block h-3 w-3 shrink-0 text-brand-muted">
                              <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
                              <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
                            </span>
                          </summary>
                          <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted">
                            {item.a}
                          </p>
                        </details>
                      ))}
                    </div>
                  </section>
                );
              })}

              <div className="border-t border-brand-border pt-8">
                <p className="text-sm leading-7 text-brand-muted">
                  Still unsure? Write to{' '}
                  <a
                    href="mailto:clients@maisonvalere.com"
                    className="text-brand-fg underline underline-offset-4"
                  >
                    clients@maisonvalere.com
                  </a>{' '}
                  or{' '}
                  <Link href="/contact" className="text-brand-fg underline underline-offset-4">
                    send us a message
                  </Link>
                  .
                </p>
                <Link
                  href="/shipping"
                  className="group mt-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-brand-fg"
                >
                  Shipping & delivery
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                    strokeWidth={1}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
