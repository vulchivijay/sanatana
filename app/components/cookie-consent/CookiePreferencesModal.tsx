/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (prefs: Record<string, boolean>) => void;
  initial?: Record<string, boolean>;
};

const TABS = [
  { id: 'your-privacy', title: 'Your Privacy', description: 'Overview of how we handle your data and cookies.' },
  { id: 'strictly-necessary', title: 'Strictly Necessary Cookies', description: 'These cookies are required for the website to function and cannot be switched off.' },
  { id: 'functionality', title: 'Functionality Cookies', description: 'Enable enhanced site features and remember choices you make.' },
  { id: 'performance', title: 'Performance Cookies', description: 'Collect information about site performance to help us improve.' },
  { id: 'targeting', title: 'Targeting Cookies', description: 'Used to deliver adverts more relevant to you and your interests.' }
];

export default function CookiePreferencesModal({ open, onClose, onSave, initial = {} }: Props) {
  const [active, setActive] = useState<string>('your-privacy');
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    strictlyNecessary: true,
    functionality: !!initial.functionality,
    performance: !!initial.performance,
    targeting: !!initial.targeting,
  });

  if (!open) return null;

  function toggle(key: string) {
    if (key === 'strictlyNecessary') return; // cannot toggle
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function save() {
    onSave(prefs);
    onClose();
  }

  function acceptAll() {
    const all = { strictlyNecessary: true, functionality: true, performance: true, targeting: true };
    setPrefs(all);
    onSave(all);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full content-wrapper rounded-lg">
        <div className="flex justify-between items-center">
          <h3>Cookie Preference Manager</h3>
          <button aria-label="close" onClick={onClose}>✕</button>
        </div>

        <div className="flex gap-4">
          <nav role="menu" className="w-1/3">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActive(t.id)} >
                {t.title}
              </button>
            ))}
          </nav>

          <div className="w-2/3">
            <div>
              <h4>{TABS.find(t => t.id === active)?.title}</h4>
              <p>{TABS.find(t => t.id === active)?.description}</p>
            </div>

            {active === 'your-privacy' && (
              <div>
                <p>We use cookies to help improve the site, analyze traffic, and serve personalized content when you consent.</p>
              </div>
            )}

            {active === 'strictly-necessary' && (
              <div>
                <p>These cookies are essential for basic site operation and cannot be declined.</p>
                <div>
                  <label>
                    <input type="checkbox" checked disabled />
                    <span>Strictly necessary (always enabled)</span>
                  </label>
                </div>
              </div>
            )}

            {active !== 'your-privacy' && active !== 'strictly-necessary' && (
              <div>
                <div>
                  <p>Enable {TABS.find(t => t.id === active)?.title}</p>
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        active === 'functionality' ? !!prefs.functionality : active === 'performance' ? !!prefs.performance : !!prefs.targeting
                      }
                      onChange={() => toggle(active === 'functionality' ? 'functionality' : active === 'performance' ? 'performance' : 'targeting')}
                    />
                  </label>
                </div>
                <p>You can change this later by opening the Cookie Preference Manager.</p>
              </div>
            )}

            <div>
              <div>
                <button onClick={onClose}>Cancel</button>
                <button onClick={save}>Save preferences</button>
                <button onClick={acceptAll}>Accept all</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */