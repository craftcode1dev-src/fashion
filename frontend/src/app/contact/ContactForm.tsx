'use client';

import { useState, FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';

const SUBJECTS = [
  'Client care',
  'Order enquiry',
  'Sizing advice',
  'Private appointment',
  'Press',
  'Other',
];

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: SUBJECTS[0],
    message: '',
  });

  function update(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status !== 'idle') return;

    setStatus('sending');

    // Demonstration: record locally, then confirm. No message leaves the browser.
    try {
      const stored = JSON.parse(localStorage.getItem('mv-messages') || '[]');
      const list = Array.isArray(stored) ? stored : [];
      localStorage.setItem(
        'mv-messages',
        JSON.stringify([{ ...form, sent_at: new Date().toISOString() }, ...list].slice(0, 20))
      );
    } catch {
      // Storage unavailable — still confirm
    }

    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <div className="border-t border-brand-fg pt-8">
        <p className="text-[10px] uppercase tracking-[0.25em] text-brand-accent">
          Message received
        </p>
        <h2 className="mt-4 font-display font-bold uppercase text-3xl text-brand-fg md:text-4xl">
          Thank you, {form.name.split(' ')[0] || 'and welcome'}.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-7 text-brand-muted">
          A client advisor will reply to{' '}
          <span className="text-brand-fg">{form.email}</span> within one business
          day. For urgent matters, write to clients@maisonvalere.com.
        </p>
        <button
          onClick={() => {
            setForm({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
            setStatus('idle');
          }}
          className="mt-8 inline-flex items-center gap-3 border border-brand-fg px-7 py-3.5 text-[10px] uppercase tracking-[0.2em] text-brand-fg transition-colors hover:bg-brand-fg hover:text-white"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-brand-muted"
          >
            Name *
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={update}
            required
            autoComplete="name"
            placeholder="Your full name"
            className="w-full border border-brand-border bg-transparent px-4 py-3 text-sm text-brand-fg placeholder:text-brand-muted/60 focus:border-brand-fg focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-brand-muted"
          >
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            required
            autoComplete="email"
            placeholder="email@example.com"
            className="w-full border border-brand-border bg-transparent px-4 py-3 text-sm text-brand-fg placeholder:text-brand-muted/60 focus:border-brand-fg focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-brand-muted"
          >
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={update}
            autoComplete="tel"
            placeholder="+33 6 00 00 00 00"
            className="w-full border border-brand-border bg-transparent px-4 py-3 text-sm text-brand-fg placeholder:text-brand-muted/60 focus:border-brand-fg focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="subject"
            className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-brand-muted"
          >
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={update}
            className="w-full cursor-pointer appearance-none border border-brand-border bg-brand-bg px-4 py-3 text-sm text-brand-fg focus:border-brand-fg focus:outline-none"
          >
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-brand-muted"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={update}
            required
            rows={6}
            placeholder="How may we help?"
            className="w-full resize-none border border-brand-border bg-transparent px-4 py-3 text-sm leading-6 text-brand-fg placeholder:text-brand-muted/60 focus:border-brand-fg focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-brand-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[10px] leading-5 tracking-wide text-brand-muted">
          By sending this message you agree to our Privacy Policy. This form is a
          demonstration and stores nothing on a server.
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 bg-brand-fg px-8 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-brand-accent disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending' : 'Send message'}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
            strokeWidth={1}
          />
        </button>
      </div>
    </form>
  );
}
