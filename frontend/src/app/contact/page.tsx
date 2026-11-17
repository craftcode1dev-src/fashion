import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Maison Valère — client care, private appointments at the Paris atelier, press enquiries and order support.',
  alternates: { canonical: '/contact' },
};

const DETAILS = [
  {
    label: 'The Atelier',
    lines: ['24 Rue de la Paix', '75002 Paris, France'],
  },
  {
    label: 'Appointments',
    lines: ['Monday – Saturday', '10:00 – 18:00 CET', 'By appointment only'],
  },
  {
    label: 'Client Care',
    lines: ['clients@maisonvalere.com', '+33 1 42 60 00 00'],
  },
  {
    label: 'Press',
    lines: ['press@maisonvalere.com'],
  },
];

export default function ContactPage() {
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
                Contact the
                <br />
                <em className="italic">atelier.</em>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-sm leading-7 text-brand-muted">
                For sizing advice, order questions or a private appointment in Paris,
                our client advisors reply within one business day.
              </p>
            </div>
          </div>

          <div className="grid gap-16 pt-12 lg:grid-cols-12 lg:gap-20">
            {/* Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Details */}
            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-1">
                {DETAILS.map((detail) => (
                  <div key={detail.label} className="border-t border-brand-border pt-5">
                    <h2 className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                      {detail.label}
                    </h2>
                    <div className="mt-3 space-y-1 text-sm leading-6 text-brand-fg">
                      {detail.lines.map((line) =>
                        line.includes('@') ? (
                          <p key={line}>
                            <a
                              href={`mailto:${line}`}
                              className="transition-colors hover:text-brand-accent"
                            >
                              {line}
                            </a>
                          </p>
                        ) : (
                          <p key={line}>{line}</p>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-brand-border pt-5">
                <h2 className="text-[10px] uppercase tracking-[0.25em] text-brand-muted">
                  Before writing
                </h2>
                <p className="mt-3 text-sm leading-7 text-brand-muted">
                  Answers on delivery, returns and care may already be in our{' '}
                  <Link
                    href="/faq"
                    className="text-brand-fg underline underline-offset-4"
                  >
                    frequently asked questions
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
