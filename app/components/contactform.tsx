/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useMemo, useState } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';

type Field = {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

type Props = {
  fields?: Field[];
  submitButton?: { label?: string; action?: string } | null;
};

export default function ContactForm({ fields, submitButton }: Props) {
  const localeObj = useLocaleSection('sharable-strings');
  const defaults: Field[] = useMemo(() => ([
    { name: 'name', type: 'text', label: localeObj?.contactForm?.name || 'Name', placeholder: localeObj?.contactForm?.placeholderName || '' },
    { name: 'email', type: 'email', label: localeObj?.contactForm?.email || 'Email', placeholder: localeObj?.contactForm?.placeholderEmail || '', required: true },
    { name: 'message', type: 'textarea', label: localeObj?.contactForm?.message || 'Message', placeholder: localeObj?.contactForm?.placeholderMessage || '', required: true }
  ]), [localeObj]);

  const usedFields = Array.isArray(fields) && fields.length > 0 ? fields : defaults;

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of usedFields) init[f.name] = '';
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const init: Record<string, string> = {};
    for (const f of usedFields) init[f.name] = '';
    setValues(init);
  }, [JSON.stringify(usedFields)]);

  const handleChange = (name: string, v: string) => setValues(s => ({ ...s, [name]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    for (const f of usedFields) {
      if (f.required && !values[f.name]) {
        setErrorMessage(localeObj?.contactForm?.validationError || 'Please fill required fields');
        return;
      }
    }
    const configuredEndpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT?.trim();
    const localizedEndpoint = submitButton?.action?.trim();
    const endpoint = configuredEndpoint || (
      process.env.NODE_ENV === 'production'
        ? (localizedEndpoint && /^https?:\/\//i.test(localizedEndpoint) ? localizedEndpoint : undefined)
        : '/api/contact'
    );
    if (!endpoint) {
      setErrorMessage(localeObj?.contactForm?.error || 'Contact form is not configured yet. Please use the contact details listed on this page.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ values }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSuccessMessage(localeObj?.contactForm?.thanks || 'Thank you — message sent.');
        const init: Record<string, string> = {};
        for (const f of usedFields) init[f.name] = '';
        setValues(init);
      } else {
        setErrorMessage((data && data.error) ? String(data.error) : (localeObj?.contactForm?.error || 'Failed to send message'));
      }
    } catch (err: any) {
      setErrorMessage(err && err.message ? err.message : (localeObj?.contactForm?.error || 'Failed to send message'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!usedFields || usedFields.length === 0) return null;

  return (
    <form onSubmit={handleSubmit} className="p-3 md:p-6 animate-fadeInUp">
      <div className="bg-gradient-to-br from-amber-50 via-pink-50 to-rose-100 rounded-3xl shadow-2xl border-4 border-pink-200/60 overflow-hidden text-md sm:text-base leading-relaxed font-normal animate-gradient-x">
        {/* Decorative header */}
        <div className="relative bg-gradient-to-r from-pink-500 via-amber-400 to-rose-500 p-6 text-center text-md sm:text-base leading-relaxed font-normal animate-gradient-x animate-fadeIn">
          <div className="absolute inset-0 opacity-20 bg-[url('/images/contact-bg.png')] bg-cover bg-center rounded-3xl" />
          <div className="relative z-10 text-md sm:text-base leading-relaxed font-normal">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl shadow-xl text-md sm:text-base leading-relaxed font-normal animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white text-2xl font-semibold leading-snug mb-2 drop-shadow-lg animate-gradient-x">Get In Touch</h3>
            <p className="text-white/90 text-md sm:text-base leading-relaxed mb-4 font-normal animate-fadeIn delay-100">We&apos;d love to hear from you</p>
          </div>
        </div>

        {/* Form fields */}
        <div className="p-6 space-y-4 text-md sm:text-base leading-relaxed font-normal">
          {usedFields.map((f) => (
            <div key={f.name} className="group text-md sm:text-base leading-relaxed font-normal">
              <label className="block text-md sm:text-base font-semibold mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-focus-within:scale-150 transition-transform duration-300 text-md sm:text-base leading-relaxed font-normal"></span>
                {f.label || f.name}
                {f.required && <span className="text-orange-500 text-md sm:text-base leading-relaxed font-normal">*</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  value={values[f.name] || ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none shadow-sm hover:shadow-md"
                  rows={6}
                  placeholder={f.placeholder || ''}
                  required={!!f.required}
                />
              ) : (
                <input
                  type={f.type || 'text'}
                  value={values[f.name] || ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 shadow-sm hover:shadow-md"
                  placeholder={f.placeholder || ''}
                  required={!!f.required}
                />
              )}
            </div>
          ))}

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 animate-fade-in text-md sm:text-base leading-relaxed font-normal">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-md sm:text-base leading-relaxed font-normal">{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 animate-fade-in text-md sm:text-base leading-relaxed font-normal">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-md sm:text-base leading-relaxed font-normal">{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full group relative overflow-hidden px-6 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:via-orange-600 hover:to-amber-600 text-white text-md sm:text-base rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="relative z-10 flex items-center justify-center gap-3 text-md sm:text-base leading-relaxed font-normal">
              {submitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75 text-md sm:text-base leading-relaxed mb-4 font-normal" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {localeObj?.contactForm?.sending || 'Sending...'}
                </>
              ) : (
                <>
                  <span>{(submitButton && submitButton.label) ? submitButton.label : (localeObj?.contactForm?.sendMessage || 'Send Message')}</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 text-md sm:text-base leading-relaxed font-normal" />
          </button>
        </div>
      </div>
    </form>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
