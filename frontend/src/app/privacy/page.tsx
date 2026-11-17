import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy — Maison Valère',
  description: 'Privacy Policy for Maison Valère. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <main className="bg-brand-bg">
        {/* Page header */}
        <div className="border-b border-brand-border">
          <div className="max-w-screen-md mx-auto px-6 md:px-12 py-20 md:py-28">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-accent mb-5">Legal</p>
            <h1 className="font-display font-semibold uppercase text-5xl md:text-6xl text-brand-fg mb-5">Privacy Policy</h1>
            <p className="text-brand-muted text-sm">Last updated: 1 January 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-screen-md mx-auto px-6 md:px-12 py-16 md:py-24 space-y-14">

          <section className="space-y-4">
            <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg">1. Introduction</h2>
            <div className="space-y-3 text-brand-muted leading-relaxed text-[15px]">
              <p>
                Maison Valère SAS (&ldquo;Maison Valère&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting and respecting your privacy.
                This Privacy Policy sets out the basis on which any personal data we collect from you,
                or that you provide to us, will be processed by us.
              </p>
              <p>
                Please read the following carefully to understand our views and practices regarding
                your personal data and how we will treat it. By using our website and services,
                you acknowledge the terms of this Privacy Policy.
              </p>
            </div>
          </section>

          <div className="border-t border-brand-border" />

          <section className="space-y-4">
            <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg">2. Information We Collect</h2>
            <div className="space-y-3 text-brand-muted leading-relaxed text-[15px]">
              <p>We may collect and process the following data about you:</p>
              <ul className="space-y-2 pl-5 list-none">
                {[
                  'Identity data: first name, last name, title, date of birth.',
                  'Contact data: billing address, delivery address, email address, telephone numbers.',
                  'Financial data: payment card details (processed securely via our payment provider; we do not store raw card numbers).',
                  'Transaction data: details about payments to and from you, and other details of products and services you have purchased.',
                  'Technical data: internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types, operating system and platform.',
                  'Usage data: information about how you use our website and services.',
                  'Marketing and communication preferences: your preferences in receiving marketing from us.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-accent mt-1 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="border-t border-brand-border" />

          <section className="space-y-4">
            <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg">3. How We Use Your Information</h2>
            <div className="space-y-3 text-brand-muted leading-relaxed text-[15px]">
              <p>We use the information we hold about you in the following ways:</p>
              <ul className="space-y-2 pl-5 list-none">
                {[
                  'To process and fulfil your orders, including sending order confirmations and delivery updates.',
                  'To manage your account and provide customer support.',
                  'To personalise your experience on our website and tailor recommendations to you.',
                  'To send you marketing communications where you have consented to receive them.',
                  'To comply with our legal and regulatory obligations.',
                  'To detect, investigate and prevent fraudulent transactions and other illegal activities.',
                  'To analyse and improve our website, products, and services.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-accent mt-1 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="border-t border-brand-border" />

          <section className="space-y-4">
            <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg">4. Legal Basis for Processing</h2>
            <div className="space-y-3 text-brand-muted leading-relaxed text-[15px]">
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will
                use your personal data in the following circumstances:
              </p>
              <ul className="space-y-2 pl-5 list-none">
                {[
                  'Where we need to perform the contract we are about to enter into or have entered into with you.',
                  'Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.',
                  'Where we need to comply with a legal obligation.',
                  'Where you have given us your consent to do so.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-accent mt-1 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="border-t border-brand-border" />

          <section className="space-y-4">
            <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg">5. Data Sharing</h2>
            <div className="space-y-3 text-brand-muted leading-relaxed text-[15px]">
              <p>
                We do not sell, trade, or rent your personal data to third parties. We may share your
                personal data with trusted third-party service providers who assist us in operating our
                website and conducting our business, subject to those parties agreeing to keep this
                information confidential. These include:
              </p>
              <ul className="space-y-2 pl-5 list-none">
                {[
                  'Payment processors and financial institutions for transaction processing.',
                  'Delivery and logistics partners for order fulfilment.',
                  'Email and communication service providers.',
                  'Analytics providers to help us improve our services.',
                  'Legal, regulatory, and law enforcement authorities when required by law.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-accent mt-1 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="border-t border-brand-border" />

          <section className="space-y-4">
            <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg">6. Data Retention</h2>
            <div className="space-y-3 text-brand-muted leading-relaxed text-[15px]">
              <p>
                We will only retain your personal data for as long as reasonably necessary to fulfil
                the purposes we collected it for, including for the purposes of satisfying any legal,
                regulatory, tax, accounting or reporting requirements. We may retain your personal
                data for a longer period in the event of a complaint or if we reasonably believe
                there is a prospect of litigation.
              </p>
              <p>
                To determine the appropriate retention period for personal data, we consider the amount,
                nature and sensitivity of the personal data, the potential risk of harm from unauthorised
                use or disclosure of your personal data, the purposes for which we process your personal
                data and whether we can achieve those purposes through other means, and the applicable
                legal, regulatory, tax, accounting or other requirements.
              </p>
            </div>
          </section>

          <div className="border-t border-brand-border" />

          <section className="space-y-4">
            <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg">7. Your Rights</h2>
            <div className="space-y-3 text-brand-muted leading-relaxed text-[15px]">
              <p>Under applicable data protection law, you have the right to:</p>
              <ul className="space-y-2 pl-5 list-none">
                {[
                  'Request access to your personal data.',
                  'Request correction of your personal data.',
                  'Request erasure of your personal data.',
                  'Object to processing of your personal data.',
                  'Request restriction of processing your personal data.',
                  'Request transfer of your personal data.',
                  'Withdraw consent at any time where we are relying on consent to process your personal data.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-accent mt-1 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                To exercise any of these rights, please contact us at{' '}
                <a
                  href="mailto:privacy@maisonvalere.com"
                  className="text-brand-fg underline underline-offset-2 hover:text-brand-accent transition-colors"
                >
                  privacy@maisonvalere.com
                </a>
                . We will respond to your request within 30 days.
              </p>
            </div>
          </section>

          <div className="border-t border-brand-border" />

          <section className="space-y-4">
            <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg">8. Cookies</h2>
            <div className="space-y-3 text-brand-muted leading-relaxed text-[15px]">
              <p>
                Our website uses cookies to distinguish you from other users of our website. This helps
                us to provide you with a good experience when you browse our website and also allows us
                to improve our site. By continuing to browse the site, you are agreeing to our use of cookies.
              </p>
              <p>
                We use the following types of cookies: strictly necessary cookies (required for the
                website to function), analytical/performance cookies (to recognise and count visitors),
                and functionality cookies (to remember your preferences). You can set your browser to
                refuse all or some cookies, though this may affect functionality.
              </p>
            </div>
          </section>

          <div className="border-t border-brand-border" />

          <section className="space-y-4">
            <h2 className="font-display font-semibold uppercase text-2xl text-brand-fg">9. Contact</h2>
            <div className="space-y-3 text-brand-muted leading-relaxed text-[15px]">
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, please contact
                our Data Protection Officer:
              </p>
              <div className="bg-brand-surface border border-brand-border p-6 space-y-1 text-sm">
                <p className="font-medium text-brand-fg">Maison Valère SAS</p>
                <p>24 Rue de la Paix, 75001 Paris, France</p>
                <p>
                  Email:{' '}
                  <a
                    href="mailto:privacy@maisonvalere.com"
                    className="text-brand-fg underline underline-offset-2 hover:text-brand-accent transition-colors"
                  >
                    privacy@maisonvalere.com
                  </a>
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
