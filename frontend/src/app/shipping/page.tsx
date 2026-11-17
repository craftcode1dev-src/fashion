import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Shipping & Returns — Maison Valère',
  description:
    'Free shipping on orders over €250. Concierge delivery available. 30-day free returns. Learn about our shipping and returns policy.',
};

const REGIONS = [
  { region: 'France', standard: '2–3 business days', express: '1 business day' },
  { region: 'European Union', standard: '3–5 business days', express: '2–3 business days' },
  { region: 'United Kingdom', standard: '3–5 business days', express: '2–3 business days' },
  { region: 'United States & Canada', standard: '5–7 business days', express: '3–4 business days' },
  { region: 'Middle East', standard: '5–7 business days', express: '3–4 business days' },
  { region: 'Asia Pacific', standard: '6–9 business days', express: '4–5 business days' },
  { region: 'Rest of World', standard: '7–12 business days', express: '5–7 business days' },
];

export default function ShippingPage() {
  return (
    <>
      <Header />

      <main className="bg-brand-bg">
        {/* Page header */}
        <div className="border-b border-brand-border">
          <div className="max-w-screen-md mx-auto px-6 md:px-12 py-20 md:py-28">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-accent mb-5">Service</p>
            <h1 className="font-display font-semibold uppercase text-5xl md:text-6xl text-brand-fg mb-4">
              Shipping & Returns
            </h1>
            <p className="text-brand-muted text-sm max-w-sm leading-relaxed">
              We believe the acquisition of a beautiful garment should be as pleasurable as wearing it.
            </p>
          </div>
        </div>

        <div className="max-w-screen-md mx-auto px-6 md:px-12 py-16 md:py-24 space-y-16">

          {/* Shipping Options */}
          <section>
            <h2 className="font-display font-semibold uppercase text-3xl text-brand-fg mb-8">Shipping Options</h2>

            {/* Free shipping highlight */}
            <div className="bg-brand-surface border border-brand-border p-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full bg-brand-accent shrink-0 self-stretch" />
                <div>
                  <h3 className="font-display font-semibold uppercase text-xl text-brand-fg mb-2">Complimentary Shipping</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    All orders over <span className="text-brand-fg font-medium">€250</span> qualify for free standard
                    shipping to any destination worldwide. No code required — the discount is applied automatically at checkout.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Standard */}
              <div className="border border-brand-border p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-display font-semibold uppercase text-lg text-brand-fg">Standard Delivery</h3>
                  <span className="text-brand-muted text-sm">€12 – €25</span>
                </div>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Delivered by our logistics partners in carefully sealed, branded packaging.
                  Tracking information is provided by email once your order is dispatched.
                  Orders placed before 12:00 CET on business days are dispatched the same day.
                </p>
              </div>

              {/* Express */}
              <div className="border border-brand-border p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-display font-semibold uppercase text-lg text-brand-fg">Express Delivery</h3>
                  <span className="text-brand-muted text-sm">€30 – €55</span>
                </div>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Priority handling and expedited transit for time-sensitive occasions.
                  Requires signature on delivery. Available to most destinations worldwide.
                </p>
              </div>

              {/* Concierge */}
              <div className="border border-brand-border p-6 bg-brand-fg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-display font-semibold uppercase text-lg text-white">Concierge Delivery</h3>
                  <span className="text-white/60 text-sm">€75</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  Our most elevated delivery experience. A Maison Valère representative delivers
                  your order by hand, in Paris and select cities by arrangement. Includes
                  gift-wrapping, a handwritten note, and an optional unboxing appointment.
                  Contact us to arrange: <a href="mailto:concierge@maisonvalere.com" className="underline underline-offset-2 text-white hover:text-brand-surface transition-colors">concierge@maisonvalere.com</a>.
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-brand-border" />

          {/* Delivery Timeframes */}
          <section>
            <h2 className="font-display font-semibold uppercase text-3xl text-brand-fg mb-8">Delivery Timeframes</h2>
            <p className="text-brand-muted text-sm leading-relaxed mb-8">
              Timeframes are estimates from dispatch date and exclude weekends and public holidays.
              All orders include full tracking. We ship to over 90 countries.
            </p>
            <div className="border border-brand-border overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-3 bg-brand-surface px-6 py-3 border-b border-brand-border">
                <span className="text-xs uppercase tracking-[0.1em] text-brand-muted">Region</span>
                <span className="text-xs uppercase tracking-[0.1em] text-brand-muted">Standard</span>
                <span className="text-xs uppercase tracking-[0.1em] text-brand-muted">Express</span>
              </div>
              {REGIONS.map((row, i) => (
                <div
                  key={row.region}
                  className={`grid grid-cols-3 px-6 py-4 border-b border-brand-border last:border-0 ${
                    i % 2 === 0 ? 'bg-brand-bg' : 'bg-brand-surface'
                  }`}
                >
                  <span className="text-sm text-brand-fg">{row.region}</span>
                  <span className="text-sm text-brand-muted">{row.standard}</span>
                  <span className="text-sm text-brand-muted">{row.express}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-brand-muted mt-4">
              * Customs and import duties may apply to international orders and are the responsibility of the recipient.
            </p>
          </section>

          <div className="border-t border-brand-border" />

          {/* Returns Policy */}
          <section>
            <h2 className="font-display font-semibold uppercase text-3xl text-brand-fg mb-8">Returns Policy</h2>

            <div className="space-y-5 text-brand-muted leading-relaxed text-[15px] mb-10">
              <p>
                We offer <span className="text-brand-fg font-medium">complimentary returns within 30 days</span> of
                delivery for all orders. We ask only that pieces are returned in their original condition —
                unworn, unaltered, with all tags and packaging intact.
              </p>
              <p>
                Items marked as Final Sale at the time of purchase are not eligible for return or exchange.
                Bespoke and made-to-measure pieces are non-returnable by their nature.
              </p>
              <p>
                We inspect every return upon receipt. Pieces that show signs of wear, alteration, or
                damage will not be accepted and will be returned to the sender. We appreciate your
                understanding.
              </p>
            </div>

            {/* Returns steps */}
            <h3 className="font-display font-semibold uppercase text-xl text-brand-fg mb-6">How to Initiate a Return</h3>
            <div className="space-y-5">
              {[
                {
                  step: '01',
                  title: 'Contact Us',
                  desc: 'Email returns@maisonvalere.com with your order number and the item(s) you wish to return. Our team will respond within 24 hours.',
                },
                {
                  step: '02',
                  title: 'Receive Your Return Label',
                  desc: 'We will send you a prepaid return shipping label by email, along with packaging guidelines to ensure your pieces travel safely.',
                },
                {
                  step: '03',
                  title: 'Package Your Items',
                  desc: 'Please re-use the original box and tissue where possible, ensuring all original tags, dust bags, and packaging materials are included.',
                },
                {
                  step: '04',
                  title: 'Drop Off or Arrange Collection',
                  desc: 'Hand your package to any approved carrier location. For Concierge clients, we can arrange a collection from your preferred address.',
                },
                {
                  step: '05',
                  title: 'Receive Your Refund',
                  desc: 'Once we have received and inspected your return, your refund will be processed to the original payment method within 5–10 business days.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 py-5 border-b border-brand-border last:border-0">
                  <span className="text-xs text-brand-accent font-sans shrink-0 mt-0.5">{item.step}</span>
                  <div>
                    <h4 className="text-sm font-medium text-brand-fg mb-1">{item.title}</h4>
                    <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-brand-border" />

          {/* Need help CTA */}
          <section className="text-center py-8">
            <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg mb-4">Questions?</h2>
            <p className="text-brand-muted text-sm mb-8 max-w-sm mx-auto">
              Our client services team is available Monday to Friday, 9:00–18:00 CET.
            </p>
            <a
              href="/contact"
              className="inline-block bg-brand-fg text-white text-xs uppercase tracking-[0.2em] px-10 py-4 hover:bg-brand-accent transition-colors"
            >
              Contact Us
            </a>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
