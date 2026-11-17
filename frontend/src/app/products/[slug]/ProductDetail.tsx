'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  Truck,
  X,
} from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useWishlist } from '@/lib/wishlist-context';
import { getAllProducts } from '@/lib/catalog';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';

interface ProductDetailProps {
  product: Product;
  related: Product[];
}

const RECENT_KEY = 'mv-recently-viewed';

const APPAREL_GUIDE = [
  { size: 'XS', chest: '86–90', waist: '70–74', hip: '90–94' },
  { size: 'S', chest: '91–96', waist: '75–80', hip: '95–100' },
  { size: 'M', chest: '97–102', waist: '81–86', hip: '101–106' },
  { size: 'L', chest: '103–108', waist: '87–92', hip: '107–112' },
  { size: 'XL', chest: '109–114', waist: '93–98', hip: '113–118' },
  { size: 'XXL', chest: '115–120', waist: '99–104', hip: '119–124' },
];

const BOTTOM_GUIDE = [
  { size: '28', chest: '—', waist: '71–73', hip: '89–91' },
  { size: '30', chest: '—', waist: '76–78', hip: '94–96' },
  { size: '32', chest: '—', waist: '81–83', hip: '99–101' },
  { size: '34', chest: '—', waist: '86–88', hip: '104–106' },
  { size: '36', chest: '—', waist: '91–93', hip: '109–111' },
];

export default function ProductDetail({ product, related }: ProductDetailProps) {
  const images = product.images ?? [];
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [recent, setRecent] = useState<Product[]>([]);
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(product.slug);

  const colors = useMemo(() => {
    const map = new Map<string, ProductVariant>();
    product.variants?.forEach((v) => {
      if (!map.has(v.color_name)) map.set(v.color_name, v);
    });
    return Array.from(map.values());
  }, [product.variants]);

  const [colorName, setColorName] = useState<string | null>(
    colors[0]?.color_name ?? null
  );
  const sizes = useMemo(
    () => (product.variants ?? []).filter((v) => v.color_name === colorName),
    [product.variants, colorName]
  );
  const [variant, setVariant] = useState<ProductVariant | null>(
    sizes.find((v) => v.stock > 0) ?? sizes[0] ?? null
  );

  /* Track recently viewed products */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const stored: string[] = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(stored) ? stored.filter((s) => typeof s === 'string') : [];
      const next = [product.slug, ...list.filter((s) => s !== product.slug)].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));

      const all = getAllProducts();
      // Recent views are read from browser storage after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecent(
        next
          .filter((slug) => slug !== product.slug)
          .map((slug) => all.find((p) => p.slug === slug))
          .filter((p): p is Product => Boolean(p))
          .slice(0, 4)
      );
    } catch {
      // Storage unavailable — silently skip
    }
  }, [product.slug]);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const stepImage = useCallback(
    (dir: 1 | -1) => {
      setActiveImage((i) => Math.min(images.length - 1, Math.max(0, i + dir)));
    },
    [images.length]
  );

  /* Keyboard controls for the lightbox */
  useEffect(() => {
    if (!lightboxOpen && !sizeGuideOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
        setSizeGuideOpen(false);
      }
      if (lightboxOpen && e.key === 'ArrowRight') stepImage(1);
      if (lightboxOpen && e.key === 'ArrowLeft') stepImage(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, sizeGuideOpen, stepImage]);

  function selectColor(name: string) {
    setColorName(name);
    const options = (product.variants ?? []).filter((v) => v.color_name === name);
    setVariant(options.find((v) => v.stock > 0) ?? options[0] ?? null);
    setQuantity(1);
  }

  const price = product.price + (variant?.price_modifier ?? 0);
  const hasDiscount =
    product.compare_at_price !== null && product.compare_at_price > price;
  const inStock = sizes.some((s) => s.stock > 0);
  const gallery = images;

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-5 lg:px-10 lg:pb-28 lg:pt-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-brand-muted lg:mb-9"
        >
          <Link href="/" className="transition-colors hover:text-brand-fg">
            Home
          </Link>
          <span aria-hidden>/</span>
          {product.category && (
            <>
              <Link
                href={`/collections/${product.category.slug}`}
                className="transition-colors hover:text-brand-fg"
              >
                {product.category.name}
              </Link>
              <span aria-hidden>/</span>
            </>
          )}
          <span className="text-brand-fg">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="group relative aspect-[4/5] overflow-hidden bg-brand-surface sm:aspect-[3/4]">
              {gallery[activeImage] ? (
                <Image
                  src={gallery[activeImage].image_url}
                  alt={gallery[activeImage].alt_text || product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-brand-muted">
                  Maison Valère
                </div>
              )}

              {/* Badges */}
              <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
                {product.is_new_arrival && (
                  <span className="bg-brand-fg px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-brand-bg">
                    New
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-brand-accent px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white">
                    Sale
                  </span>
                )}
                {!product.is_new_arrival && product.is_bestseller && (
                  <span className="border border-brand-fg/20 bg-brand-bg/95 px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-brand-fg">
                    Best Seller
                  </span>
                )}
              </div>

              {/* Expand */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Open image viewer"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-bg/85 text-brand-fg backdrop-blur-sm transition-colors hover:bg-brand-bg"
              >
                <Expand className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>

              {/* Arrows */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => stepImage(-1)}
                    disabled={activeImage === 0}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-bg/85 text-brand-fg opacity-0 backdrop-blur transition-opacity duration-300 hover:bg-brand-bg group-hover:opacity-100 disabled:hidden focus-visible:opacity-100 max-lg:opacity-100"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => stepImage(1)}
                    disabled={activeImage === gallery.length - 1}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-bg/85 text-brand-fg opacity-0 backdrop-blur transition-opacity duration-300 hover:bg-brand-bg group-hover:opacity-100 disabled:hidden focus-visible:opacity-100 max-lg:opacity-100"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </>
              )}

              {/* Counter */}
              {gallery.length > 1 && (
                <span className="absolute bottom-3 right-3 bg-brand-fg/80 px-2 py-1 text-[8px] tabular-nums tracking-[0.14em] text-brand-bg">
                  {String(activeImage + 1).padStart(2, '0')} /{' '}
                  {String(gallery.length).padStart(2, '0')}
                </span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-2.5 grid grid-cols-4 gap-2 sm:gap-3">
                {gallery.map((image, i) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={i === activeImage}
                    className={`relative aspect-[3/4] overflow-hidden bg-brand-surface transition-opacity duration-300 ${
                      i === activeImage
                        ? 'opacity-100'
                        : 'opacity-50 hover:opacity-90'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      fill
                      sizes="16vw"
                      className="object-cover"
                      unoptimized
                    />
                    {i === activeImage && (
                      <span className="absolute inset-0 border border-brand-fg" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="mb-2.5 text-[9px] font-medium uppercase tracking-[0.24em] text-brand-muted">
                {product.subcategory ?? product.category?.name}
                {product.origin && (
                  <span className="ml-2 text-brand-muted/70">— {product.origin}</span>
                )}
              </p>
              <h1 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-bold uppercase leading-[0.88] tracking-[-0.01em]">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="mt-2.5 text-[13px] leading-5 text-brand-muted">
                  {product.subtitle}
                </p>
              )}

              <div className="mt-5 flex items-baseline gap-3 tabular-nums">
                <span
                  className={`text-[17px] font-semibold ${
                    hasDiscount ? 'text-brand-accent' : 'text-brand-fg'
                  }`}
                >
                  {formatPrice(price)}
                </span>
                {hasDiscount && (
                  <span className="text-[13px] text-brand-muted/70 line-through">
                    {formatPrice(product.compare_at_price!)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-brand-accent/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-accent">
                    Save{' '}
                    {Math.round(
                      ((product.compare_at_price! - price) /
                        product.compare_at_price!) *
                        100
                    )}
                    %
                  </span>
                )}
              </div>

              <p className="mt-5 text-[13px] leading-6 text-brand-muted">
                {product.description}
              </p>

              {/* Colour */}
              {colors.length > 0 && (
                <div className="mt-7">
                  <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.2em] text-brand-muted">
                    Colour — <span className="text-brand-fg">{colorName}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {colors.map((color) => {
                      const selected = colorName === color.color_name;
                      return (
                        <button
                          key={color.color_name}
                          onClick={() => selectColor(color.color_name)}
                          aria-label={color.color_name}
                          aria-pressed={selected}
                          title={color.color_name}
                          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                            selected
                              ? 'border-brand-fg'
                              : 'border-transparent hover:border-brand-border'
                          }`}
                        >
                          <span
                            className="block h-7 w-7 rounded-full border border-black/10"
                            style={{ backgroundColor: color.color_hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size */}
              {sizes.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-brand-muted">
                      Size
                    </p>
                    <button
                      type="button"
                      onClick={() => setSizeGuideOpen(true)}
                      className="inline-flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-brand-fg underline-offset-4 transition-colors hover:text-brand-accent hover:underline"
                    >
                      <Ruler className="h-3 w-3" strokeWidth={1.5} />
                      Size guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const soldOut = size.stock <= 0;
                      const selected = variant?.id === size.id;
                      return (
                        <button
                          key={size.id}
                          onClick={() => setVariant(size)}
                          disabled={soldOut}
                          aria-pressed={selected}
                          className={`min-w-[3rem] border px-3.5 py-2.5 text-[10px] font-medium uppercase tracking-[0.1em] transition-all duration-300 ${
                            selected
                              ? 'border-brand-fg bg-brand-fg text-brand-bg'
                              : 'border-brand-border text-brand-fg hover:border-brand-fg'
                          } ${
                            soldOut
                              ? 'cursor-not-allowed border-brand-border/70 text-brand-muted/35 line-through hover:border-brand-border/70'
                              : ''
                          }`}
                        >
                          {size.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity + Add */}
              <div className="mt-7 flex items-stretch gap-2.5">
                <div className="flex h-14 items-center border border-brand-border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-full w-10 items-center justify-center text-brand-muted transition-colors hover:text-brand-fg"
                  >
                    <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                  <span className="w-7 text-center text-[13px] font-semibold tabular-nums text-brand-fg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(9, q + 1))}
                    aria-label="Increase quantity"
                    className="flex h-full w-10 items-center justify-center text-brand-muted transition-colors hover:text-brand-fg"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="flex-1">
                  <AddToCartButton
                    product={product}
                    selectedVariant={variant}
                    quantity={quantity}
                  />
                </div>

                <button
                  onClick={() => toggle(product.slug)}
                  aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={saved}
                  className={`flex h-14 w-14 shrink-0 items-center justify-center border transition-colors duration-300 ${
                    saved
                      ? 'border-brand-accent text-brand-accent'
                      : 'border-brand-border text-brand-fg hover:border-brand-fg'
                  }`}
                >
                  <Heart
                    className={`h-[18px] w-[18px] ${
                      saved ? 'animate-heart-pop fill-brand-accent' : ''
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              <p className="mt-2.5 text-[9px] uppercase tracking-[0.16em] text-brand-muted">
                {inStock ? 'In stock — ships within 24h' : 'Currently sold out'}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 border-y border-brand-border py-4">
                <div className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.1em] text-brand-muted">
                  <Truck className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  Free shipping over €250
                </div>
                <div className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.1em] text-brand-muted">
                  <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  30-day free returns
                </div>
              </div>

              {/* Accordion */}
              <div className="mt-3 divide-y divide-brand-border border-b border-brand-border">
                {product.fit_advice && (
                  <Detail label="Fit & sizing">
                    <p>{product.fit_advice}</p>
                  </Detail>
                )}
                {product.composition && (
                  <Detail label="Materials">
                    <p>{product.composition}</p>
                    {product.origin && <p>{product.origin}</p>}
                  </Detail>
                )}
                {product.care_instructions && (
                  <Detail label="Care">
                    <p>{product.care_instructions}</p>
                  </Detail>
                )}
                <Detail label="Delivery & returns">
                  <p>
                    Complimentary standard delivery on orders over €250,
                    dispatched from Paris within one business day. Express
                    delivery is available at checkout.
                  </p>
                  <p>
                    Returns are free within 30 days of delivery, provided
                    garments are unworn with tags attached.
                  </p>
                </Detail>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-brand-border px-5 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-brand-border pb-5">
              <div>
                <p className="mb-3 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.26em] text-brand-muted">
                  <span className="h-px w-7 bg-brand-accent" />
                  Complete the look
                </p>
                <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em]">
                  You may also like
                </h2>
              </div>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
              >
                Shop all
                <ChevronRight
                  className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently viewed */}
      {recent.length > 0 && (
        <section className="border-t border-brand-border bg-brand-surface px-5 py-14 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.26em] text-brand-muted">
                  <span className="h-px w-7 bg-brand-accent" />
                  Pick up where you left off
                </p>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold uppercase leading-[0.86] tracking-[-0.015em]">
                  Recently viewed
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:grid-cols-4 lg:gap-x-6">
              {recent.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} image viewer`}
        aria-hidden={!lightboxOpen}
        className={`fixed inset-0 z-[70] flex flex-col bg-brand-fg/97 text-brand-bg transition-opacity duration-300 ${
          lightboxOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-[9px] uppercase tracking-[0.22em] text-brand-bg/60">
            {product.name} — {String(activeImage + 1).padStart(2, '0')} /{' '}
            {String(gallery.length).padStart(2, '0')}
          </p>
          <button
            onClick={closeLightbox}
            aria-label="Close image viewer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-brand-bg transition-colors hover:bg-white hover:text-brand-fg"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="relative flex-1 px-4 pb-6">
          {gallery[activeImage] && (
            <Image
              src={gallery[activeImage].image_url}
              alt={gallery[activeImage].alt_text || product.name}
              fill
              sizes="100vw"
              className="object-contain"
              unoptimized
            />
          )}

          {gallery.length > 1 && (
            <>
              <button
                onClick={() => stepImage(-1)}
                disabled={activeImage === 0}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/25 disabled:opacity-25 sm:left-8"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => stepImage(1)}
                disabled={activeImage === gallery.length - 1}
                aria-label="Next image"
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/25 disabled:opacity-25 sm:right-8"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="flex items-center justify-center gap-2 px-5 pb-5">
            {gallery.map((image, i) => (
              <button
                key={image.id}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                aria-pressed={i === activeImage}
                className={`h-1.5 w-8 transition-colors ${
                  i === activeImage ? 'bg-brand-bg' : 'bg-white/25 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Size guide */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        aria-hidden={!sizeGuideOpen}
        className={`fixed inset-0 z-[70] flex items-end justify-center p-0 transition-opacity duration-300 sm:items-center sm:p-6 ${
          sizeGuideOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          onClick={() => setSizeGuideOpen(false)}
          className="absolute inset-0 bg-brand-fg/50 backdrop-blur-[2px]"
        />
        <div
          className={`relative max-h-[88vh] w-full max-w-2xl overflow-y-auto bg-brand-bg p-6 transition-transform duration-300 sm:p-8 ${
            sizeGuideOpen ? 'translate-y-0' : 'translate-y-6'
          }`}
        >
          <div className="mb-5 flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.24em] text-brand-muted">
                Fit reference
              </p>
              <h2 className="font-display text-3xl font-bold uppercase leading-none">
                Size guide
              </h2>
            </div>
            <button
              onClick={() => setSizeGuideOpen(false)}
              aria-label="Close size guide"
              className="text-brand-muted transition-colors hover:text-brand-fg"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <p className="mb-5 text-[12px] leading-6 text-brand-muted">
            All measurements are body measurements in centimetres. Our pieces are
            cut with room for movement — if you are between sizes on outerwear,
            take the larger.
          </p>

          <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-brand-muted">
            Apparel — XS to XXL
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[12px]">
              <thead>
                <tr className="border-b border-brand-fg">
                  <th className="py-2 pr-4 text-[9px] font-medium uppercase tracking-[0.14em]">
                    Size
                  </th>
                  <th className="py-2 pr-4 text-[9px] font-medium uppercase tracking-[0.14em]">
                    Chest
                  </th>
                  <th className="py-2 pr-4 text-[9px] font-medium uppercase tracking-[0.14em]">
                    Waist
                  </th>
                  <th className="py-2 text-[9px] font-medium uppercase tracking-[0.14em]">
                    Hip
                  </th>
                </tr>
              </thead>
              <tbody>
                {APPAREL_GUIDE.map((row) => (
                  <tr key={row.size} className="border-b border-brand-border">
                    <td className="py-2 pr-4 font-semibold">{row.size}</td>
                    <td className="py-2 pr-4 tabular-nums text-brand-muted">
                      {row.chest}
                    </td>
                    <td className="py-2 pr-4 tabular-nums text-brand-muted">
                      {row.waist}
                    </td>
                    <td className="py-2 tabular-nums text-brand-muted">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mb-2 mt-7 text-[9px] uppercase tracking-[0.2em] text-brand-muted">
            Denim & trousers — waist sizes
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[12px]">
              <thead>
                <tr className="border-b border-brand-fg">
                  <th className="py-2 pr-4 text-[9px] font-medium uppercase tracking-[0.14em]">
                    Size
                  </th>
                  <th className="py-2 pr-4 text-[9px] font-medium uppercase tracking-[0.14em]">
                    Waist
                  </th>
                  <th className="py-2 text-[9px] font-medium uppercase tracking-[0.14em]">
                    Hip
                  </th>
                </tr>
              </thead>
              <tbody>
                {BOTTOM_GUIDE.map((row) => (
                  <tr key={row.size} className="border-b border-brand-border">
                    <td className="py-2 pr-4 font-semibold">{row.size}</td>
                    <td className="py-2 pr-4 tabular-nums text-brand-muted">
                      {row.waist}
                    </td>
                    <td className="py-2 tabular-nums text-brand-muted">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 border-t border-brand-border pt-4 text-[11px] leading-5 text-brand-muted">
            Still unsure? Email{' '}
            <a
              href="mailto:care@maisonvalere.com"
              className="underline underline-offset-2 transition-colors hover:text-brand-fg"
            >
              care@maisonvalere.com
            </a>{' '}
            and our team will help you choose.
          </p>
        </div>
      </div>
    </>
  );
}

function Detail({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group py-3.5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[9px] font-medium uppercase tracking-[0.2em] text-brand-fg [&::-webkit-details-marker]:hidden">
        {label}
        <span className="relative block h-3 w-3 text-brand-muted">
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
          <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
        </span>
      </summary>
      <div className="mt-2.5 space-y-2 text-[12px] leading-6 text-brand-muted">
        {children}
      </div>
    </details>
  );
}
