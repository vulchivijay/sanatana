/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useState } from 'react';
import storage from '../../../lib/storage';
import Link from 'next/link';
import Marquee from '../marquee';

type BannerProps = {
  id: string,
  message: {
    title: string,
    subtitle: string,
    lbeforetext: string,
    lbetweentext: string,
    laftertext: string,
    links: {
      alive: string,
      iam: string,
      githubcopilot: string,
      chatgpt: string,
      and: string,
    }
  };
  marquee: string;
  showClose?: boolean,
};

export default function BannerNotifications({ id, message, marquee, showClose = false }: BannerProps) {
  const [closed, setClosed] = useState(false);

  // compute a small deterministic hash from the message content so each
  // distinct message (even if rendered in the same banner id) can be closed
  // independently. This avoids collisions if the `id` is reused over time.
  function hashString(str: string) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      // djb2
      h = (h * 33) ^ str.charCodeAt(i);
    }
    // keep it small and positive
    return (h >>> 0).toString(36);
  }

  const messageKey = (() => {
    try {
      const s = JSON.stringify(message || {});
      return `sanatana_notification_closed_${id}_${hashString(s)}`;
    } catch (e) {
      return `sanatana_notification_closed_${id}`;
    }
  })();

  useEffect(() => {
    try {
      const val = storage.getItem(messageKey) || null;
      if (val === "1") setTimeout(() => setClosed(true), 0);
    } catch (e) {
      // ignore storage errors
    }
  }, [messageKey]);

  function closeBanner() {
    try {
      storage.setItem(messageKey, "1", { type: "session" });
    } catch (e) {
      // ignore
    }
    setClosed(true);
  }

  if (closed) return null;

  const { title, subtitle } = message;
  const { lbeforetext } = message || "";
  const { lbetweentext } = message || "";
  const { laftertext } = message || "";
  const { links } = message || "";
  const { alive } = links || "";
  const { iam } = links || "";
  const { githubcopilot } = links || "";
  const { chatgpt } = links || "";
  const { and } = links || "";

  return (
    <div className="notifiction-bar border-b-4 border-amber-200">
      {showClose ? (
        <button aria-label="Close notification" onClick={closeBanner} className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-white text-red-600 shadow-md">×</button>
      ) : null}
      {marquee === "true" ? <Marquee id={id}>
        {title}
          {alive ? <Link href={alive} title="Make a small donation!" className="underline underline-text-color">alive</Link> : null}
        {lbeforetext && iam && lbetweentext && laftertext ? <> {lbeforetext} <Link href={iam} target="_blank" title="Vulchi Vijaya Kumar Raju" className="underline underline-text-color">Iam</Link>
          {lbetweentext} <Link href={githubcopilot} target="_blank" title="Github Copilot" className="underline underline-text-color">Github Copilot</Link>
          {and} <Link href={chatgpt} title="ChatGPT" target="_blank" className="underline underline-text-color"> ChatGPT</Link>
          {laftertext} </> : null}
        {subtitle}
      </Marquee> : <div className="flex items-center justify-center">{title} {subtitle}</div>}
    </div >
  )
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
