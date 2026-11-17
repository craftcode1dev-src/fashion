'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { IMAGES } from '@/lib/catalog';
import SearchOverlay from './SearchOverlay';

const ANNOUNCEMENTS = [
  'Free express shipping over €250',
  'Autumn / Winter 2026 — now live',
  'Free returns within 30 days',
  'Members get first access — join the list',
];

const NAV_LINKS = [
  { label: 'Men', href: '/collections/men' },
  { label: 'Women', href: '/collections/women' },
  { label: 'Accessories', href: '/collections/accessories' },
  { label: 'Collections', href: '/shop', mega: true },
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Sale', href: '/collections/sale', accent: true },
];

const MEGA_EDITS = [
  { label: 'New Season', href: '/collections/new-season', note: 'AW26, first drop' },
  { label: 'Essential Outerwear', href: '/collections/essential-outerwear', note: 'Coats & jackets' },
  { label: 'Everyday Uniform', href: '/collections/everyday-uniform', note: 'Tees, sweats, shirts' },
  { label: 'Denim & Trousers', href: '/collections/denim-trousers', note: 'The foundation' },
  { label: 'Graphic Tees', href: '/collections/graphic-tees', note: 'Heavy jersey' },
];

const MEGA_SHOP = [
  { label: 'Men', href: '/collections/men' },
  { label: 'Women', href: '/collections/women' },
  { label: 'Accessories', href: '/collections/accessories' },
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Sale', href: '/collections/sale' },
];

const MOBILE_LINKS = [
  { label: 'Men', href: '/collections/men' },
  { label: 'Women', href: '/collections/women' },
  { label: 'Accessories', href: '/collections/accessories' },
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Sale', href: '/collections/sale' },
  { label: 'Our Story', href: '/about' },
];

interface HeaderProps {
  /** Transparent over a full-bleed hero (homepage); solid once scrolled */
  overlay?: boolean;
}

export default function Header({ overlay = false }: HeaderProps) {
  const { itemCount, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcement, setAnnouncement] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setAnnouncement((current) => (current + 1) % ANNOUNCEMENTS.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  // Close transient UI on navigation
  useEffect(() => {
    // Navigation is an external state change; dismiss any overlays from the previous route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Lock body scroll while an overlay is open
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, searchOpen]);

  // Dismiss the mega menu on outside click / Escape
  useEffect(() => {
    if (!megaOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMegaOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMegaOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [megaOpen]);

  const transparent = overlay && !scrolled;
  const tone = transparent ? 'text-brand-bg' : 'text-brand-fg';
  const isActive = (href: string) => {
    if (href === '/shop') return pathname === '/shop';
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`${overlay ? 'fixed' : 'sticky'} inset-x-0 top-0 z-40`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        {/* Announcement bar */}
        <div className="relative overflow-hidden border-b border-white/10 bg-brand-fg text-brand-bg">
          <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-center gap-3 px-4">
            <span className="hidden h-1 w-1 shrink-0 rounded-full bg-brand-accent sm:block" />
            <p
              key={announcement}
              aria-live="polite"
              className="animate-[fade-up_500ms_cubic-bezier(0.22,1,0.36,1)_both] truncate text-center text-[9px] font-medium uppercase tracking-[0.26em] sm:text-[10px]"
            >
              {ANNOUNCEMENTS[announcement]}
            </p>
            <span className="hidden h-1 w-1 shrink-0 rounded-full bg-brand-accent sm:block" />
          </div>
        </div>

        {/* Navigation */}
        <nav
          className={`border-b transition-colors duration-500 ${tone} ${
            transparent
              ? 'border-transparent bg-transparent'
              : 'border-brand-border bg-brand-bg/92 backdrop-blur-xl'
          }`}
        >
          <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 lg:h-[74px] lg:px-8">
            {/* Mobile trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="-ml-1 p-1.5 lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" strokeWidth={1.6} />
            </button>

            {/* Wordmark */}
            <Link
              href="/"
              aria-label="Maison Valère — home"
              className="shrink-0 leading-none"
            >
              <span className="block font-display text-[22px] font-bold uppercase leading-none tracking-[0.015em] sm:text-[25px] lg:text-[27px]">
                Maison Valère
              </span>
              <span
                className={`mt-1 hidden text-[7px] font-medium uppercase tracking-[0.44em] sm:block ${
                  transparent ? 'text-brand-bg/55' : 'text-brand-muted'
                }`}
              >
                Paris — workwear, re-cut
              </span>
            </Link>

            {/* Desktop links */}
            <ul className="ml-auto hidden items-center gap-6 lg:flex xl:gap-8">
              {NAV_LINKS.map((link) =>
                link.mega ? (
                  <li key={link.label} className="relative">
                    <button
                      type="button"
                      onClick={() => setMegaOpen((open) => !open)}
                      onMouseEnter={() => setMegaOpen(true)}
                      onFocus={() => setMegaOpen(true)}
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                      className={`flex items-center gap-1.5 py-2 text-[10px] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-55 ${
                        megaOpen ? 'opacity-100' : 'opacity-90'
                      }`}
                    >
                      {link.label}
                      <span
                        className={`h-1 w-1 rounded-full transition-colors ${
                          megaOpen ? 'bg-brand-accent' : 'bg-current opacity-40'
                        }`}
                      />
                    </button>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      data-active={isActive(link.href)}
                      className={`link-underline py-2 text-[10px] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-55 ${
                        link.accent ? 'text-brand-accent' : ''
                      } ${isActive(link.href) ? 'opacity-100' : 'opacity-90'}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-0.5 lg:ml-0 lg:gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 transition-opacity hover:opacity-55"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>

              <Link
                href="/account"
                className="hidden p-2 transition-opacity hover:opacity-55 sm:block"
                aria-label="Account"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>

              <Link
                href="/wishlist"
                className="relative hidden p-2 transition-opacity hover:opacity-55 sm:block"
                aria-label={`Wishlist, ${wishCount} ${wishCount === 1 ? 'item' : 'items'}`}
              >
                <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {wishCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[9px] font-semibold leading-none text-white tabular-nums">
                    {wishCount}
                  </span>
                )}
              </Link>

              <button
                onClick={openCart}
                className="relative p-2 transition-opacity hover:opacity-55"
                aria-label={`Open shopping bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span
                    className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold leading-none tabular-nums ${
                      transparent
                        ? 'bg-brand-bg text-brand-fg'
                        : 'bg-brand-accent text-white'
                    }`}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mega menu */}
          <div
            className={`absolute inset-x-0 top-full hidden border-b border-brand-border bg-brand-bg text-brand-fg shadow-[0_34px_60px_-32px_rgba(21,21,15,0.35)] transition-all duration-300 lg:block ${
              megaOpen
                ? 'pointer-events-auto translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-2 opacity-0'
            }`}
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-10 px-8 py-9">
              <div className="col-span-4">
                <p className="eyebrow mb-5 text-brand-muted">The Edits</p>
                <ul className="space-y-1">
                  {MEGA_EDITS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group flex items-baseline justify-between gap-4 border-b border-transparent py-2 transition-colors hover:border-brand-border"
                      >
                        <span className="font-display text-[25px] font-semibold uppercase leading-none transition-colors group-hover:text-brand-accent">
                          {item.label}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.16em] text-brand-muted">
                          {item.note}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 border-l border-brand-border pl-8">
                <p className="eyebrow mb-5 text-brand-muted">Shop</p>
                <ul className="space-y-3.5">
                  {MEGA_SHOP.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors hover:text-brand-accent"
                      >
                        {item.label}
                        <ArrowUpRight
                          className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-3">
                <Link href="/collections/new-season" className="group block">
                  <div className="relative aspect-[5/4] overflow-hidden bg-brand-surface">
                    <Image
                      src={IMAGES.megaNewSeason}
                      alt="New season campaign"
                      fill
                      sizes="(max-width: 1280px) 25vw, 320px"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      unoptimized
                    />
                    <span className="absolute left-3 top-3 bg-brand-bg/95 px-2 py-1 text-[8px] font-medium uppercase tracking-[0.2em]">
                      AW26
                    </span>
                  </div>
                  <p className="mt-3 font-display text-xl font-semibold uppercase leading-none">
                    New Season
                  </p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-brand-muted">
                    Shop the first drop
                  </p>
                </Link>
              </div>

              <div className="col-span-3">
                <Link href="/collections/denim-trousers" className="group block">
                  <div className="relative aspect-[5/4] overflow-hidden bg-brand-surface">
                    <Image
                      src={IMAGES.megaDenim}
                      alt="Denim detail"
                      fill
                      sizes="(max-width: 1280px) 25vw, 320px"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      unoptimized
                    />
                    <span className="absolute left-3 top-3 bg-brand-bg/95 px-2 py-1 text-[8px] font-medium uppercase tracking-[0.2em]">
                      Denim
                    </span>
                  </div>
                  <p className="mt-3 font-display text-xl font-semibold uppercase leading-none">
                    Rigid & Washed
                  </p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-brand-muted">
                    Shop denim & trousers
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu — full screen */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-50 lg:hidden ${
          mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-brand-charcoal text-brand-bg transition-opacity duration-500 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`relative flex h-full flex-col transition-all duration-500 ${
            mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/15 px-5 py-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-lg font-bold uppercase tracking-[0.03em] text-brand-bg"
            >
              Maison Valère
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-brand-bg"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 pb-8 pt-7">
            <ul className="space-y-0">
              {MOBILE_LINKS.map((link, i) => (
                <li
                  key={link.href}
                  className={`border-b border-white/12 transition-all duration-500 ${
                    mobileMenuOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-3 opacity-0'
                  }`}
                  style={{ transitionDelay: `${70 + i * 35}ms` }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-baseline gap-4 py-4"
                  >
                    <span className="w-5 text-[9px] tabular-nums tracking-[0.16em] text-brand-bg/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-display text-[42px] font-semibold uppercase leading-none transition-colors group-hover:text-brand-accent ${
                        link.label === 'Sale' ? 'text-brand-accent' : 'text-brand-bg'
                      }`}
                    >
                      {link.label}
                    </span>
                    <ArrowRight
                      className="ml-auto h-4 w-4 -translate-x-2 text-brand-bg/50 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      strokeWidth={1.5}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="border border-white/25 px-4 py-3 text-[9px] uppercase tracking-[0.18em] text-brand-bg"
              >
                My Account
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between border border-white/25 px-4 py-3 text-[9px] uppercase tracking-[0.18em] text-brand-bg"
              >
                Wishlist
                <span className="tabular-nums text-brand-bg/50">{wishCount}</span>
              </Link>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className="mt-3 flex w-full items-center justify-between border border-brand-accent bg-brand-accent px-4 py-3 text-[9px] uppercase tracking-[0.18em] text-white"
            >
              Shopping Bag
              <span className="tabular-nums">{itemCount}</span>
            </button>

            <div className="mt-8 flex items-center gap-4">
              <span className="h-px w-8 bg-white/25" />
              <p className="text-[9px] uppercase leading-5 tracking-[0.18em] text-brand-bg/45">
                Paris — Est. 2010
                <br />
                Made in Europe
              </p>
            </div>
          </nav>
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
