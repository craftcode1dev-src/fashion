'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/lib/types';

type ShippingMethod = 'standard' | 'concierge';
type PaymentMethod = 'card' | 'pay_later';

interface CustomerInfo {
  full_name: string;
  email: string;
  phone: string;
  address_line1: string;
  city: string;
  postal_code: string;
  country: string;
}

interface PaymentInfo {
  method: PaymentMethod;
  card_number: string;
  expiry: string;
  cvv: string;
}

const COUNTRIES = [
  'France',
  'United Kingdom',
  'Germany',
  'Italy',
  'Spain',
  'Belgium',
  'Netherlands',
  'Switzerland',
  'Austria',
  'United States',
  'Canada',
  'Australia',
  'Japan',
  'Other',
];

const ORDERS_KEY = 'mv-orders';

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  return `MV-${stamp}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, isHydrated } = useCart();

  const [step, setStep] = useState<1 | 2>(1);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [customer, setCustomer] = useState<CustomerInfo>({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    city: '',
    postal_code: '',
    country: 'France',
  });
  const [payment, setPayment] = useState<PaymentInfo>({
    method: 'card',
    card_number: '',
    expiry: '',
    cvv: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingCost =
    shippingMethod === 'concierge' ? 75 : subtotal >= 250 ? 0 : 35;
  const total = subtotal + shippingCost;

  function handleCustomerChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePaymentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPayment((prev) => ({
      ...prev,
      [name]:
        name === 'card_number'
          ? value
              .replace(/\D/g, '')
              .slice(0, 16)
              .replace(/(.{4})/g, '$1 ')
              .trim()
          : value,
    }));
  }

  const contactComplete = Boolean(
    customer.full_name.trim() &&
      customer.email.trim() &&
      customer.address_line1.trim() &&
      customer.city.trim() &&
      customer.postal_code.trim() &&
      customer.country
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();

      const order: Order = {
        id: Date.now(),
        order_number: orderNumber,
        customer_name: customer.full_name,
        customer_email: customer.email,
        subtotal,
        shipping_cost: shippingCost,
        tax: 0,
        total,
        order_status: 'confirmed',
        payment_status: payment.method === 'pay_later' ? 'pending' : 'paid',
        created_at: new Date().toISOString(),
        shipping_address: customer.address_line1,
        shipping_city: customer.city,
        shipping_postal_code: customer.postal_code,
        shipping_country: customer.country,
        shipping_method:
          shippingMethod === 'concierge' ? 'Concierge Delivery' : 'Standard Delivery',
        payment_method:
          payment.method === 'pay_later' ? 'Pay Later' : 'Credit / Debit Card',
        items: items.map((item) => {
          const itemPrice = item.product.price + (item.variant?.price_modifier ?? 0);
          return {
            product_id: item.product.id,
            product_variant_id: item.variant?.id ?? null,
            product_name: item.product.name,
            variant_label:
              [item.variant?.color_name, item.variant?.size]
                .filter(Boolean)
                .join(' / ') || null,
            price: itemPrice,
            quantity: item.quantity,
            total: itemPrice * item.quantity,
            image_url: item.product.images?.[0]?.image_url ?? null,
            slug: item.product.slug,
          } as Order['items'][number] & { slug: string };
        }),
      };

      // Demo checkout: persist the order locally and confirm.
      try {
        const stored = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
        const existing = Array.isArray(stored) ? stored : [];
        localStorage.setItem(
          ORDERS_KEY,
          JSON.stringify([order, ...existing].slice(0, 20))
        );
      } catch {
        // Storage unavailable — the confirmation page will fall back gracefully
      }

      clearCart();
      router.push(`/order/${orderNumber}`);
    } catch {
      setError('We could not place your order. Please try again.');
      setIsSubmitting(false);
    }
  }

  if (!isHydrated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-brand-bg">
          <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12">
            <div className="h-10 w-56 animate-pulse bg-brand-surface" />
            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
              <div className="h-[420px] animate-pulse bg-brand-surface" />
              <div className="h-[300px] animate-pulse bg-brand-surface" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-brand-bg">
          <div className="mx-auto max-w-[1440px] px-6 py-24 text-center lg:px-12">
            <h1 className="font-display text-5xl font-bold uppercase leading-[0.84] text-brand-fg md:text-6xl">
              Nothing to check out
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-[13px] leading-6 text-brand-muted">
              Add a piece to your bag before continuing to checkout.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex h-12 items-center gap-2.5 bg-brand-fg px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-bg transition-colors hover:bg-brand-accent hover:text-white"
            >
              Shop all pieces
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-12 lg:px-12 lg:pt-16">
          <div className="flex flex-col gap-6 border-b border-brand-border pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link
                href="/cart"
                className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-muted transition-colors hover:text-brand-fg"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.25} />
                Back to bag
              </Link>
              <h1 className="font-display text-[clamp(2.6rem,7vw,5rem)] font-bold uppercase leading-[0.82] tracking-[-0.015em] text-brand-fg">
                Checkout
              </h1>
            </div>

            <ol className="flex items-center gap-3 text-[10px] uppercase tracking-[0.16em]">
              <li>
                <button
                  onClick={() => step === 2 && setStep(1)}
                  className={`flex items-center gap-2 ${
                    step === 1 ? 'text-brand-fg' : 'text-brand-accent hover:text-brand-fg'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] ${
                      step === 1
                        ? 'border-brand-fg bg-brand-fg text-white'
                        : 'border-brand-accent bg-brand-accent text-white'
                    }`}
                  >
                    {step === 2 ? '✓' : '1'}
                  </span>
                  Information
                </button>
              </li>
              <ChevronRight size={14} className="text-brand-muted" strokeWidth={1.25} />
              <li
                className={`flex items-center gap-2 ${
                  step === 2 ? 'text-brand-fg' : 'text-brand-muted'
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] ${
                    step === 2
                      ? 'border-brand-fg bg-brand-fg text-white'
                      : 'border-brand-border'
                  }`}
                >
                  2
                </span>
                Payment
              </li>
            </ol>
          </div>

          <div className="grid gap-12 pt-10 lg:grid-cols-[1fr_380px] lg:gap-16">
            {/* Form */}
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-10">
                  <section>
                    <h2 className="mb-5 border-b border-brand-border pb-3 font-display text-xl font-bold uppercase leading-none text-brand-fg">
                      Contact
                    </h2>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Full name *"
                        name="full_name"
                        value={customer.full_name}
                        onChange={handleCustomerChange}
                        placeholder="Your full name"
                        autoComplete="name"
                        required
                        className="sm:col-span-2"
                      />
                      <Field
                        label="Email *"
                        name="email"
                        type="email"
                        value={customer.email}
                        onChange={handleCustomerChange}
                        placeholder="email@example.com"
                        autoComplete="email"
                        required
                      />
                      <Field
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={customer.phone}
                        onChange={handleCustomerChange}
                        placeholder="+33 6 00 00 00 00"
                        autoComplete="tel"
                      />
                    </div>
                  </section>

                  <section>
                    <h2 className="mb-5 border-b border-brand-border pb-3 font-display text-xl font-bold uppercase leading-none text-brand-fg">
                      Shipping address
                    </h2>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Address *"
                        name="address_line1"
                        value={customer.address_line1}
                        onChange={handleCustomerChange}
                        placeholder="Street address"
                        autoComplete="address-line1"
                        required
                        className="sm:col-span-2"
                      />
                      <Field
                        label="City *"
                        name="city"
                        value={customer.city}
                        onChange={handleCustomerChange}
                        placeholder="Paris"
                        autoComplete="address-level2"
                        required
                      />
                      <Field
                        label="Postal code *"
                        name="postal_code"
                        value={customer.postal_code}
                        onChange={handleCustomerChange}
                        placeholder="75001"
                        autoComplete="postal-code"
                        required
                      />
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="country"
                          className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-brand-muted"
                        >
                          Country *
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={customer.country}
                          onChange={handleCustomerChange}
                          autoComplete="country-name"
                          className="w-full cursor-pointer appearance-none border border-brand-border bg-brand-bg px-4 py-3 text-sm text-brand-fg transition-colors focus:border-brand-fg focus:outline-none"
                        >
                          {COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="mb-5 border-b border-brand-border pb-3 font-display text-xl font-bold uppercase leading-none text-brand-fg">
                      Delivery
                    </h2>
                    <div className="space-y-3">
                      {[
                        {
                          value: 'standard' as const,
                          title: 'Standard Delivery',
                          detail: '5–7 business days · signature on delivery',
                          price:
                            subtotal >= 250 ? 'Free' : formatPrice(35),
                        },
                        {
                          value: 'concierge' as const,
                          title: 'Concierge Delivery',
                          detail: '2–3 business days · white glove, Paris dispatch',
                          price: formatPrice(75),
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-start gap-4 border p-5 transition-colors duration-300 ${
                            shippingMethod === option.value
                              ? 'border-brand-fg'
                              : 'border-brand-border hover:border-brand-muted'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping_method"
                            value={option.value}
                            checked={shippingMethod === option.value}
                            onChange={() => setShippingMethod(option.value)}
                            className="mt-0.5 accent-brand-fg"
                          />
                          <span className="flex-1">
                            <span className="flex items-baseline justify-between gap-4">
                              <span className="text-sm text-brand-fg">{option.title}</span>
                              <span className="text-sm tabular-nums text-brand-fg">
                                {option.price}
                              </span>
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-brand-muted">
                              {option.detail}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </section>

                  <button
                    type="button"
                    onClick={() => {
                      if (contactComplete) {
                        setStep(2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={!contactComplete}
                    className="h-14 w-full bg-brand-fg text-[11px] uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Continue to Payment
                  </button>
                  <p className="text-center text-[10px] uppercase tracking-[0.18em] text-brand-muted">
                    Secure checkout · Demonstration only
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10">
                  <section>
                    <h2 className="mb-5 border-b border-brand-border pb-3 font-display text-xl font-bold uppercase leading-none text-brand-fg">
                      Payment
                    </h2>
                    <div className="mb-6 space-y-3">
                      {[
                        {
                          value: 'card' as const,
                          title: 'Credit / Debit Card',
                          detail: 'Visa, Mastercard, American Express',
                        },
                        {
                          value: 'pay_later' as const,
                          title: 'Pay Later',
                          detail: 'Receive an invoice by email within 24 hours',
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-start gap-4 border p-5 transition-colors duration-300 ${
                            payment.method === option.value
                              ? 'border-brand-fg'
                              : 'border-brand-border hover:border-brand-muted'
                          }`}
                        >
                          <input
                            type="radio"
                            name="method"
                            value={option.value}
                            checked={payment.method === option.value}
                            onChange={() =>
                              setPayment((prev) => ({ ...prev, method: option.value }))
                            }
                            className="mt-0.5 accent-brand-fg"
                          />
                          <span>
                            <span className="block text-sm text-brand-fg">
                              {option.title}
                            </span>
                            <span className="mt-0.5 block text-xs text-brand-muted">
                              {option.detail}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>

                    {payment.method === 'card' && (
                      <div className="space-y-5 bg-brand-surface p-6">
                        <Field
                          label="Card number"
                          name="card_number"
                          value={payment.card_number}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          mono
                        />
                        <div className="grid grid-cols-2 gap-5">
                          <Field
                            label="Expiry"
                            name="expiry"
                            value={payment.expiry}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            maxLength={5}
                            mono
                          />
                          <Field
                            label="CVV"
                            name="cvv"
                            value={payment.cvv}
                            onChange={handlePaymentChange}
                            placeholder="•••"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            maxLength={4}
                            mono
                          />
                        </div>
                        <p className="text-xs leading-5 text-brand-muted">
                          This is a demonstration checkout. No card details are
                          transmitted and no payment will be taken.
                        </p>
                      </div>
                    )}
                  </section>

                  {error && (
                    <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-brand-muted">
                    <Lock size={12} strokeWidth={1.5} />
                    <span>Demo only · no payment information is sent</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-14 w-full items-center justify-center bg-brand-fg text-[11px] uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting
                      ? 'Placing Order…'
                      : `Complete Order — ${formatPrice(total)}`}
                  </button>
                  <p className="text-center text-[10px] uppercase tracking-[0.18em] text-brand-muted">
                    Demonstration checkout · No payment taken
                  </p>
                </div>
              )}
            </form>

            {/* Summary */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="border border-brand-border bg-brand-surface/60 p-7">
                <h2 className="font-display text-2xl font-bold uppercase leading-none">Your order</h2>

                <ul className="mt-6 space-y-5 border-b border-brand-border pb-6">
                  {items.map((item) => {
                    const itemPrice =
                      item.product.price + (item.variant?.price_modifier ?? 0);
                    return (
                      <li
                        key={`${item.product.id}-${item.variant?.id ?? 'none'}`}
                        className="flex gap-4"
                      >
                        <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-brand-bg">
                          {item.product.images?.[0] && (
                            <Image
                              src={item.product.images[0].image_url}
                              alt={item.product.images[0].alt_text || item.product.name}
                              fill
                              className="object-cover"
                              unoptimized
                              sizes="64px"
                            />
                          )}
                          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-muted text-[10px] text-white tabular-nums">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-[13px] font-medium leading-snug text-brand-fg">
                            {item.product.name}
                          </p>
                          {(item.variant?.color_name || item.variant?.size) && (
                            <p className="mt-1 text-[11px] text-brand-muted">
                              {[item.variant?.color_name, item.variant?.size]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                          )}
                          <p className="mt-1 text-sm tabular-nums text-brand-fg">
                            {formatPrice(itemPrice * item.quantity)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="space-y-3 pt-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Subtotal</span>
                    <span className="tabular-nums text-brand-fg">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Shipping</span>
                    <span className="tabular-nums text-brand-fg">
                      {shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-brand-border pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-brand-muted">
                      Total
                    </span>
                    <span className="font-display text-2xl font-bold tabular-nums leading-none text-brand-fg">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] tracking-wide text-brand-muted">
                    Duties and taxes included.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
  autoComplete?: string;
  inputMode?: 'numeric' | 'text' | 'tel' | 'email';
  maxLength?: number;
  mono?: boolean;
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  className = '',
  autoComplete,
  inputMode,
  maxLength,
  mono = false,
}: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-brand-muted"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        className={`w-full border border-brand-border bg-transparent px-4 py-3 text-sm text-brand-fg transition-colors focus:border-brand-fg focus:outline-none ${
          mono ? 'font-mono tracking-wider' : ''
        }`}
      />
    </div>
  );
}
