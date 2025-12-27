/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useEffect, useState } from 'react';
import storage from '../../../lib/storage';
import { DEFAULT_LOCALE } from '../../../lib/i18n';
import { useT } from '../../hooks/useT';
import CookiePreferencesModal from './CookiePreferencesModal';

type Prefs = {
  strictlyNecessary: boolean;
  functionality?: boolean;
  performance?: boolean;
  targeting?: boolean;
};

function detectBrowserAndOS() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const lower = ua.toLowerCase();
  let browserName = 'unknown';
  let browserVersion = '';
  let osName = 'unknown';
  let osVersion = '';

  // Browser detection (basic)
  if (/edg\//i.test(ua)) {
    browserName = 'Edge';
    const m = ua.match(/Edg\/(\d+(?:\.\d+)*)/i);
    if (m) browserVersion = m[1];
  } else if (/chrome\//i.test(ua)) {
    browserName = 'Chrome';
    const m = ua.match(/Chrome\/(\d+(?:\.\d+)*)/i);
    if (m) browserVersion = m[1];
  } else if (/firefox\//i.test(ua)) {
    browserName = 'Firefox';
    const m = ua.match(/Firefox\/(\d+(?:\.\d+)*)/i);
    if (m) browserVersion = m[1];
  } else if (/safari/i.test(ua) && /version\//i.test(ua)) {
    browserName = 'Safari';
    const m = ua.match(/Version\/(\d+(?:\.\d+)*)/i);
    if (m) browserVersion = m[1];
  }

  // OS detection (basic)
  if (/windows nt/i.test(ua)) {
    osName = 'Windows';
    const m = ua.match(/Windows NT (\d+(?:\.\d+)*)/i);
    if (m) osVersion = m[1];
  } else if (/android/i.test(ua)) {
    osName = 'Android';
    const m = ua.match(/Android (\d+(?:\.\d+)*)/i);
    if (m) osVersion = m[1];
  } else if (/iphone os|ipad; cpu os/i.test(ua)) {
    osName = 'iOS';
    const m = ua.match(/OS (\d+_\d+(?:_\d+)*)/i);
    if (m) osVersion = m[1].replace(/_/g, '.');
  } else if (/mac os x/i.test(ua)) {
    osName = 'macOS';
    const m = ua.match(/Mac OS X (\d+_\d+(?:_\d+)*)/i);
    if (m) osVersion = m[1].replace(/_/g, '.');
  }

  return { ua, browserName, browserVersion, osName, osVersion };
}

async function getCoords(timeout = 2000) {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    let called = false;
    const timer = setTimeout(() => {
      if (!called) {
        called = true;
        resolve(null);
      }
    }, timeout);
    navigator.geolocation.getCurrentPosition((pos) => {
      if (called) return;
      called = true;
      clearTimeout(timer);
      resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    }, () => {
      if (called) return;
      called = true;
      clearTimeout(timer);
      resolve(null);
    }, { maximumAge: 60 * 1000, timeout });
  });
}

async function saveToServer(prefs: Prefs) {
  const uaInfo = detectBrowserAndOS();
  const coords = await getCoords(2000).catch(() => null);

  const payload = {
    prefs,
    ts: new Date().toISOString(),
    ua: uaInfo.ua,
    browserName: uaInfo.browserName,
    browserVersion: uaInfo.browserVersion,
    osName: uaInfo.osName,
    osVersion: uaInfo.osVersion,
    coords,
  };

  return fetch('/api/cookies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs | null>(null);

  useEffect(() => {
    try {
      const v = storage.getItem('sd_cookie_prefs');
      if (v) {
        setTimeout(() => setPrefs(JSON.parse(v)), 0);
        setTimeout(() => setVisible(false), 0);
      } else {
        setTimeout(() => setVisible(true), 0);
      }
    } catch (err) {
      setTimeout(() => setVisible(true), 0);
    }
  }, []);

  async function acceptAll() {
    const p: Prefs = { strictlyNecessary: true, functionality: true, performance: true, targeting: true };
    setPrefs(p);
    try {
      storage.setItem('sd_cookie_prefs', JSON.stringify(p));
    } catch (e) {
      // ignore
    }
    try { await saveToServer(p); } catch (err) { /* ignore */ }
    setVisible(false);
  }

  async function savePrefs(newPrefs: Record<string, boolean>) {
    const p: Prefs = {
      strictlyNecessary: true,
      functionality: !!newPrefs.functionality,
      performance: !!newPrefs.performance,
      targeting: !!newPrefs.targeting,
    };
    setPrefs(p);
    try {
      storage.setItem('sd_cookie_prefs', JSON.stringify(p));
    } catch (e) {
      // ignore
    }
    try { await saveToServer(p); } catch (err) { /* ignore */ }
  }

  const t = useT();

  if (!visible) return null;

  return (
    <>
      <CookiePreferencesModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={savePrefs} initial={prefs ?? {}} />

      <div className="fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-white border rounded shadow-md flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            {(() => {
              const loc = DEFAULT_LOCALE; // paragraph will be rendered via `t()` below which uses current locale from context
              const paragraph = t('cookieConsent.paragraph') as string;
              // Replace placeholders with links
              return (
                <span dangerouslySetInnerHTML={{
                  __html: paragraph
                    .replace('{cookiePolicyLink}', `<a class="underline" href="/our-cookie-policy">${t('cookieConsent.cookiePolicy')}</a>`)
                    .replace('{privacyPolicyLink}', `<a class="underline" href="/our-privacy-policy">${t('cookieConsent.privacyPolicy')}</a>`)
                    .replace('{managerLabel}', t('cookieConsent.managerButton'))
                    .replace('{acceptAllLabel}', t('cookieConsent.acceptAll'))
                }} />
              );
            })()}
          </div>

          <div className="flex gap-4">
            <button className="border rounded" onClick={() => setModalOpen(true)}>{t('cookieConsent.managerButton')}</button>
            <button className="bg-green-300 hover:bg-green-400 rounded" onClick={acceptAll}>{t('cookieConsent.acceptAll')}</button>
          </div>
        </div>
      </div>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
