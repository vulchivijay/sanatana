/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import React, { useState, useMemo } from 'react';
import { useT } from '../../hooks/useT';

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const t = useT();

  const translations = useMemo(() => {
    const keys = [
      "contactForm.visitor", "contactForm.name", "contactForm.placeholderName", "contactForm.email", "contactForm.placeholderEmail", "contactForm.message", "contactForm.placeholderMessage", "contactForm.sending", "contactForm.sendMessage"
    ];
    const obj: Record<string, string> = {};
    for (const k of keys) obj[k] = t(k);
    return obj;
  }, [t]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !message) return;
    setSubmitting(true);
    const subject = encodeURIComponent(`Website contact from ${name || (translations ? translations["contactForm.visitor"] : "Visitor")}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:vulchi.vijay@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => setSubmitting(false), 500);
  };

  if (!translations) return null;

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div>
        <label>{translations["contactForm.name"]}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-b-2"
          placeholder={translations["contactForm.placeholderName"]}
        />
      </div>

      <div>
        <label>{translations["contactForm.email"]}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-b-2"
          placeholder={translations["contactForm.placeholderEmail"]}
          required
        />
      </div>

      <div>
        <label>{translations["contactForm.message"]}</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-b-2"
          rows={6}
          placeholder={translations["contactForm.placeholderMessage"]}
          required
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-amber-300 hover:bg-amber-400"
        >
          {submitting ? translations["contactForm.sending"] : translations["contactForm.sendMessage"]}
        </button>
      </div>
    </form>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
