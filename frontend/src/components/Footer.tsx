import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const shopLinks = [
  { label: 'Men', href: '/collections/men' },
  { label: 'Women', href: '/collections/women' },
  { label: 'Accessories', href: '/collections/accessories' },
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Sale', href: '/collections/sale' },
];

const editLinks = [
  { label: 'New Season', href: '/collections/new-season' },
  { label: 'Essential Outerwear', href: '/collections/essential-outerwear' },
  { label: 'Everyday Uniform', href: '/collections/everyday-uniform' },
  { label: 'Denim & Trousers', href: '/collections/denim-trousers' },
  { label: 'Graphic Tees', href: '/collections/graphic-tees' },
];

const aboutLinks = [
  { label: 'Our Story', href: '/about' },
  { label: 'Craftsmanship', href: '/about/craftsmanship' },
  { label: 'Sustainability', href: '/about/sustainability' },
  { label: 'Contact', href: '/contact' },
];

const serviceLinks = [
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Account', href: '/account' },
  { label: 'Privacy Policy', href: '/privacy' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Pinterest', href: 'https://pinterest.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
];

const columns = [
  { title: 'Shop', links: shopLinks },
  { title: 'The Edits', links: editLinks },
  { title: 'The House', links: aboutLinks },
  { title: 'Client Services', links: serviceLinks },
];

export default function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-brand-charcoal text-brand-bg">
      <div className="mx-auto max-w-[1600px] px-5 pb-8 pt-16 lg:px-10 lg:pt-20">
        {/* Oversized wordmark */}
        <div className="relative border-b border-white/15 pb-10 lg:pb-12">
          <Link
            href="/"
            className="block font-display text-[clamp(3.4rem,13vw,11rem)] font-bold uppercase leading-[0.8] tracking-[-0.02em] text-brand-bg transition-colors hover:text-brand-accent"
          >
            Maison Valère
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2 text-[9px] uppercase tracking-[0.24em] text-brand-bg/45">
            <span>Paris — Est. 2010</span>
            <span className="hidden h-1 w-1 rounded-full bg-brand-accent/70 sm:block" />
            <span>Made in Europe</span>
            <span className="hidden h-1 w-1 rounded-full bg-brand-accent/70 sm:block" />
            <span>Workwear, re-cut</span>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-6 lg:py-14">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2 lg:pr-10">
            <p className="mb-5 text-[9px] uppercase tracking-[0.26em] text-brand-bg/40">
              The House
            </p>
            <p className="max-w-xs text-[13px] leading-6 text-brand-bg/60">
              Workwear proportions, Parisian cut. Rigid denim, heavyweight fleece
              and honest outerwear — made in Europe, built to be worn in.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-brand-bg/55 transition-colors hover:text-brand-bg"
                >
                  {social.label}
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-[9px] uppercase tracking-[0.26em] text-brand-bg/40">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[12px] leading-5 text-brand-bg/65 transition-colors duration-300 hover:text-brand-bg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-5 border-t border-white/15 pt-7 sm:flex-row sm:items-center">
          <p className="text-[10px] tracking-wide text-brand-bg/40">
            © {new Date().getFullYear()} Maison Valère. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[9px] uppercase tracking-[0.2em] text-brand-bg/40">
            <span>Visa</span>
            <span className="h-1 w-1 rounded-full bg-brand-bg/25" />
            <span>Mastercard</span>
            <span className="h-1 w-1 rounded-full bg-brand-bg/25" />
            <span>Amex</span>
            <span className="h-1 w-1 rounded-full bg-brand-bg/25" />
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
