'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/lib/types';

export type ShopMode = 'all' | 'new' | 'bestseller' | 'sale';

type PriceKey = 'under-100' | '100-200' | '200-350' | '350-600' | 'over-600';
type SortOption = 'featured' | 'newest' | 'popular' | 'price-asc' | 'price-desc';

const PRICE_OPTIONS: { value: PriceKey; label: string }[] = [
  { value: 'under-100', label: 'Under €100' },
  { value: '100-200', label: '€100 – €200' },
  { value: '200-350', label: '€200 – €350' },
  { value: '350-600', label: '€350 – €600' },
  { value: 'over-600', label: '€600 +' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low — High' },
  { value: 'price-desc', label: 'Price: High — Low' },
];

const MODE_LABELS: Record<Exclude<ShopMode, 'all'>, string> = {
  new: 'New Arrivals',
  bestseller: 'Best Sellers',
  sale: 'On Sale',
};

function matchesPriceRange(price: number, range: PriceKey): boolean {
  switch (range) {
    case 'under-100':
      return price < 100;
    case '100-200':
      return price >= 100 && price <= 200;
    case '200-350':
      return price > 200 && price <= 350;
    case '350-600':
      return price > 350 && price <= 600;
    case 'over-600':
      return price > 600;
  }
}

const SIZE_ORDER = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '36',
  '37', '38', '39', '40', '41',
  'One Size',
];

function sizeRank(size: string) {
  const i = SIZE_ORDER.indexOf(size);
  return i === -1 ? 999 : i;
}

interface ShopContentProps {
  initialProducts: Product[];
  categories: Category[];
  initialMode?: ShopMode;
  initialQuery?: string;
}

export default function ShopContent({
  initialProducts,
  categories,
  initialMode = 'all',
  initialQuery = '',
}: ShopContentProps) {
  const [mode, setMode] = useState<ShopMode>(initialMode);
  const [department, setDepartment] = useState<string>('all');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [prices, setPrices] = useState<PriceKey[]>([]);
  const [sort, setSort] = useState<SortOption>('featured');
  const [query, setQuery] = useState(initialQuery);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* Derived filter vocabularies */
  const allSubcategories = useMemo(
    () =>
      Array.from(
        new Set(initialProducts.map((p) => p.subcategory).filter(Boolean) as string[])
      ).sort(),
    [initialProducts]
  );

  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    initialProducts.forEach((p) =>
      p.variants?.forEach((v) => {
        if (!map.has(v.color_name)) map.set(v.color_name, v.color_hex);
      })
    );
    return Array.from(map.entries())
      .map(([name, hex]) => ({ name, hex }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [initialProducts]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => p.variants?.forEach((v) => set.add(v.size)));
    return Array.from(set).sort((a, b) => sizeRank(a) - sizeRank(b));
  }, [initialProducts]);

  function toggle<T>(list: T[], value: T, setter: (next: T[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function clearAll() {
    setMode('all');
    setDepartment('all');
    setSubcategories([]);
    setSizes([]);
    setColors([]);
    setPrices([]);
    setQuery('');
  }

  const filteredAndSorted = useMemo(() => {
    let result = [...initialProducts];
    const term = query.trim().toLowerCase();

    if (mode === 'new') result = result.filter((p) => p.is_new_arrival);
    if (mode === 'bestseller') result = result.filter((p) => p.is_bestseller);
    if (mode === 'sale')
      result = result.filter(
        (p) => p.compare_at_price !== null && p.compare_at_price > p.price
      );

    if (department !== 'all')
      result = result.filter((p) => p.category?.slug === department);

    if (subcategories.length > 0)
      result = result.filter((p) =>
        subcategories.includes(p.subcategory ?? '')
      );

    if (colors.length > 0)
      result = result.filter((p) =>
        p.variants?.some((v) => colors.includes(v.color_name))
      );

    if (sizes.length > 0)
      result = result.filter((p) =>
        p.variants?.some((v) => sizes.includes(v.size) && v.stock > 0)
      );

    if (prices.length > 0)
      result = result.filter((p) => prices.some((r) => matchesPriceRange(p.price, r)));

    if (term) {
      result = result.filter((p) => {
        const haystack = [
          p.name,
          p.subtitle ?? '',
          p.description,
          p.category?.name ?? '',
          p.subcategory ?? '',
          ...(p.variants?.map((v) => v.color_name) ?? []),
        ]
          .join(' ')
          .toLowerCase();
        return term.split(/\s+/).every((word) => haystack.includes(word));
      });
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort(
          (a, b) =>
            Number(b.is_new_arrival) - Number(a.is_new_arrival) ||
            (b.popularity ?? 0) - (a.popularity ?? 0)
        );
        break;
      case 'popular':
        result.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
        break;
      default:
        result.sort((a, b) =>
          Number(b.is_featured) - Number(a.is_featured) ||
          (b.popularity ?? 0) - (a.popularity ?? 0)
        );
    }

    return result;
  }, [initialProducts, mode, department, subcategories, colors, sizes, prices, query, sort]);

  const activeFilters: { key: string; label: string; onRemove: () => void }[] = [
    ...(mode !== 'all'
      ? [
          {
            key: `mode-${mode}`,
            label: MODE_LABELS[mode],
            onRemove: () => setMode('all'),
          },
        ]
      : []),
    ...(department !== 'all'
      ? [
          {
            key: `dept-${department}`,
            label:
              categories.find((c) => c.slug === department)?.name ?? department,
            onRemove: () => setDepartment('all'),
          },
        ]
      : []),
    ...subcategories.map((s) => ({
      key: `sub-${s}`,
      label: s,
      onRemove: () => setSubcategories((prev) => prev.filter((v) => v !== s)),
    })),
    ...sizes.map((s) => ({
      key: `size-${s}`,
      label: `Size ${s}`,
      onRemove: () => setSizes((prev) => prev.filter((v) => v !== s)),
    })),
    ...colors.map((c) => ({
      key: `color-${c}`,
      label: c,
      onRemove: () => setColors((prev) => prev.filter((v) => v !== c)),
    })),
    ...prices.map((p) => ({
      key: `price-${p}`,
      label: PRICE_OPTIONS.find((o) => o.value === p)?.label ?? p,
      onRemove: () => setPrices((prev) => prev.filter((v) => v !== p)),
    })),
    ...(query.trim()
      ? [
          {
            key: 'query',
            label: `“${query.trim()}”`,
            onRemove: () => setQuery(''),
          },
        ]
      : []),
  ];

  const renderFilterPanel = (idPrefix: string) => (
    <div className="space-y-8">
      <fieldset>
        <legend className="eyebrow mb-3.5 text-brand-muted">Department</legend>
        <div className="space-y-2.5">
          {[
            { value: 'all', label: 'All pieces' },
            ...categories.map((c) => ({ value: c.slug, label: c.name })),
          ].map((option) => (
            <label
              key={option.value}
              className="group flex cursor-pointer items-center gap-3"
            >
              <input
                type="radio"
                name={`${idPrefix}-department`}
                value={option.value}
                checked={department === option.value}
                onChange={() => setDepartment(option.value)}
                className="h-3.5 w-3.5 cursor-pointer accent-brand-accent"
              />
              <span className="text-[13px] text-brand-fg transition-colors group-hover:text-brand-accent">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3.5 text-brand-muted">Category</legend>
        <div className="space-y-2.5">
          {allSubcategories.map((sub) => (
            <label
              key={sub}
              className="group flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={subcategories.includes(sub)}
                onChange={() => toggle(subcategories, sub, setSubcategories)}
                className="h-3.5 w-3.5 cursor-pointer accent-brand-accent"
              />
              <span className="text-[13px] text-brand-fg transition-colors group-hover:text-brand-accent">
                {sub}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3.5 text-brand-muted">Size</legend>
        <div className="flex flex-wrap gap-1.5">
          {allSizes.map((size) => {
            const active = sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggle(sizes, size, setSizes)}
                aria-pressed={active}
                className={`min-w-[38px] border px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? 'border-brand-fg bg-brand-fg text-brand-bg'
                    : 'border-brand-border text-brand-fg hover:border-brand-fg'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3.5 text-brand-muted">Colour</legend>
        <div className="flex flex-wrap gap-2">
          {allColors.map((color) => {
            const active = colors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggle(colors, color.name, setColors)}
                aria-pressed={active}
                title={color.name}
                className={`flex items-center gap-2 border px-2.5 py-1.5 text-[10px] uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? 'border-brand-fg bg-brand-fg text-brand-bg'
                    : 'border-brand-border text-brand-fg hover:border-brand-fg'
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full border ${
                    active ? 'border-white/40' : 'border-black/15'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3.5 text-brand-muted">Price</legend>
        <div className="space-y-2.5">
          {PRICE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="group flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={prices.includes(option.value)}
                onChange={() => toggle(prices, option.value, setPrices)}
                className="h-3.5 w-3.5 cursor-pointer accent-brand-accent"
              />
              <span className="text-[13px] text-brand-fg transition-colors group-hover:text-brand-accent">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-6 lg:px-10 lg:pt-10">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-brand-border pb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-fg transition-colors hover:text-brand-accent lg:hidden"
        >
          <SlidersHorizontal size={14} strokeWidth={1.5} />
          Filter
          {activeFilters.length > 0 && (
            <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-fg px-1 text-[9px] leading-none text-white">
              {activeFilters.length}
            </span>
          )}
        </button>

        <div className="relative hidden min-w-0 flex-1 lg:block lg:max-w-xs">
          <Search
            className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-muted"
            strokeWidth={1.5}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces"
            aria-label="Search pieces"
            className="h-9 w-full border-b border-transparent bg-transparent pl-6 text-[13px] text-brand-fg placeholder:text-brand-muted/70 focus:border-brand-fg focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <p className="hidden text-[10px] uppercase tracking-[0.16em] text-brand-muted sm:block">
            {filteredAndSorted.length}{' '}
            {filteredAndSorted.length === 1 ? 'piece' : 'pieces'}
          </p>
          <label
            htmlFor="sort"
            className="hidden text-[10px] uppercase tracking-[0.16em] text-brand-muted sm:block"
          >
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-9 cursor-pointer border border-brand-border bg-transparent px-2.5 text-[11px] uppercase tracking-[0.08em] text-brand-fg focus:border-brand-fg focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-4">
          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1.5 border border-brand-border bg-brand-surface px-2.5 py-1.5 text-[9px] uppercase tracking-[0.12em] text-brand-fg"
            >
              {filter.label}
              <button
                onClick={filter.onRemove}
                aria-label={`Remove ${filter.label} filter`}
                className="text-brand-muted transition-colors hover:text-brand-fg"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="px-1.5 text-[9px] uppercase tracking-[0.12em] text-brand-muted underline underline-offset-4 transition-colors hover:text-brand-fg"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-10 pt-6 lg:gap-14">
        {/* Desktop filters */}
        <aside className="hidden w-[188px] shrink-0 lg:block">
          <div className="sticky top-32">{renderFilterPanel('desktop')}</div>
        </aside>

        {/* Grid */}
        <div className="min-w-0 flex-1">
          <p className="mb-5 text-[10px] uppercase tracking-[0.16em] text-brand-muted lg:hidden">
            {filteredAndSorted.length}{' '}
            {filteredAndSorted.length === 1 ? 'piece' : 'pieces'}
          </p>

          {filteredAndSorted.length === 0 ? (
            <div className="flex flex-col items-start py-20">
              <p className="font-display text-4xl font-semibold uppercase leading-none">
                No pieces found
              </p>
              <p className="mt-3 max-w-sm text-[13px] leading-6 text-brand-muted">
                Try removing a filter or searching for something else.
              </p>
              <button
                onClick={clearAll}
                className="mt-7 inline-flex h-11 items-center border border-brand-fg px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-fg transition-colors hover:bg-brand-fg hover:text-brand-bg"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
              {filteredAndSorted.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  sizes="(max-width: 640px) 50vw, (max-width: 1280px) 30vw, 22vw"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        aria-hidden={!drawerOpen}
        className={`fixed inset-0 z-50 lg:hidden ${
          drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-brand-fg/40 backdrop-blur-[2px] transition-opacity duration-300 ${
            drawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[86vw] max-w-[360px] flex-col bg-brand-bg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-fg">
              Filters
              {activeFilters.length > 0 && (
                <span className="ml-2 text-brand-muted">({activeFilters.length})</span>
              )}
            </p>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close filters"
              className="text-brand-muted transition-colors hover:text-brand-fg"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            {renderFilterPanel('mobile')}
          </div>
          <div className="border-t border-brand-border p-4">
            <div className="flex gap-3">
              <button
                onClick={clearAll}
                className="h-12 flex-1 border border-brand-border text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-fg"
              >
                Clear all
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="h-12 flex-[1.4] bg-brand-fg text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-bg"
              >
                Show {filteredAndSorted.length}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
