"use client";

import { useEffect, useState } from 'react';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import TextToSpeech from '@/app/components/TextToSpeech';
import PageLayout from '@components/common/PageLayout';
import { normalizePolicyContent, type PolicyContentState } from '@lib/policyNormalizer';

export default function PrivacyPolicy() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('cookies-policy');
  type PrivacyState = PolicyContentState;
  const normalizePrivacy = (src: unknown): PrivacyState => {
    try {
      return normalizePolicyContent(src);
    } catch {
      return {
        title: '',
        lastupdated: '',
        intro: {} as any,
        informationwecollect: {} as any,
        howweuse: {} as any,
        cookieslocalstorage: {} as any,
        thirdparty: {} as any,
        security: {} as any,
        rights: {} as any,
        children: {} as any,
        changes: {} as any,
        contact: {} as any,
      };
    }
  };

  // Initialize with empty state to avoid hydration mismatch
  const [privacy, setPrivacy] = useState<PrivacyState>(() => {
    return normalizePrivacy({});
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Locale loading is now handled by context/useLocaleSection
      } catch (e) { }
      if (!mounted) return;

      setPrivacy(normalizePrivacy(ns || {}));
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !privacy.title) {
    return (
      <PageLayout metaKey="cookies-policy.meta" title="cookies-policy.title" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Cookies Policy' }]} className="layout-md">
        <div className="flex items-center justify-center py-4 text-md sm:text-base leading-relaxed font-normal">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="cookies-policy.meta"
      title={privacy.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Cookies policy' }]}
      className="layout-md"
    >
      <div id="cookies-content" className="space-y-8 text-md sm:text-base leading-relaxed font-normal">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 text-md sm:text-base leading-relaxed font-normal">
          <div className="flex items-center gap-3 text-md sm:text-base leading-relaxed font-normal">
            <span className="text-md sm:text-base leading-relaxed font-normal">🔒</span>
            <strong className="text-xl md:text-md sm:text-base">{privacy.lastupdated}</strong>
          </div>
          <TextToSpeech sectionId="cookies-content" />
        </div>

        {/* Intro */}
        <section className="rounded-2xl p-4 md:p-8">
          <h3 className="flex items-center gap-3 text-2xl font-semibold leading-snug mb-3">
            <span className="text-md sm:text-base leading-relaxed font-normal">🛡️</span>
            {privacy.intro.title}
          </h3>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{privacy.intro.text}</p>
        </section>

        {/* Information We Collect */}
        <section className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
          <h4 className="flex items-center gap-3 text-xl font-semibold leading-snug mb-2">
            <span className="text-md sm:text-base leading-relaxed font-normal">📊</span>
            <span><strong>{privacy.informationwecollect.title}</strong> {privacy.informationwecollect.lead}</span>
          </h4>
          <div className="space-y-4 text-md sm:text-base leading-relaxed font-normal">
            <p><strong className="text-amber-800">{privacy.informationwecollect.usagelabel}</strong> {privacy.informationwecollect.usage}</p>
            <p><strong className="text-amber-800">{privacy.informationwecollect.devicelabel}</strong> {privacy.informationwecollect.device}</p>
            <p><strong className="text-amber-800">{privacy.informationwecollect.cookieslabel}</strong> {privacy.informationwecollect.cookies}</p>
            <p><strong className="text-amber-800">{privacy.informationwecollect.contactlabel}</strong> {privacy.informationwecollect.contact}</p>
          </div>
        </section>

        {/* How We Use */}
        <section className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
          <h4 className="text-md sm:text-base font-semibold mb-4 flex items-center gap-3">
            <span className="text-md sm:text-base leading-relaxed font-normal">🎯</span>
            {privacy.howweuse?.title}
          </h4>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{privacy.howweuse?.lead}</p>
          <ul className="space-y-3 list-disc pl-5 text-md sm:text-base leading-relaxed">
            {(privacy.howweuse?.items || []).map((p: string, i: number) => (
              <li key={i} className="flex items-start gap-3 mb-2">
                <span className="flex-shrink-0 w-2 h-2 rounded-full text-md sm:text-base leading-relaxed font-normal" />
                <span className="flex-1 text-md sm:text-base leading-relaxed font-normal">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Cookies & Local Storage */}
        <section className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
          <h5 className="text-md sm:text-base font-semibold mb-4 flex items-center gap-3">
            <span className="text-md sm:text-base leading-relaxed font-normal">🍪</span>
            {privacy.cookieslocalstorage.title}
          </h5>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{privacy.cookieslocalstorage.text}</p>
        </section>

        {/* Third Party */}
        <section className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
          <h6 className="text-md sm:text-base font-semibold mb-4 flex items-center gap-3">
            <span className="text-md sm:text-base leading-relaxed font-normal">🔗</span>
            {privacy.thirdparty.title}
          </h6>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{privacy.thirdparty.text}</p>
        </section>

        {/* Security */}
        <section className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
          <p className="flex items-center gap-3 text-md sm:text-base leading-relaxed mb-4 font-normal">
            <span className="text-md sm:text-base leading-relaxed font-normal">🔐</span>
            {privacy.security.title}
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{privacy.security.text}</p>
        </section>

        {/* Rights */}
        <section className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
          <p className="flex items-center gap-3 text-md sm:text-base leading-relaxed mb-4 font-normal">
            <span className="text-md sm:text-base leading-relaxed font-normal">⚖️</span>
            {privacy.rights.title}
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{privacy.rights.lead}</p>
          <ul className="space-y-3 list-disc pl-5 text-md sm:text-base leading-relaxed">
            {(privacy.rights?.items || []).map((p: string, i: number) => (
              <li key={i} className="flex items-start gap-3 mb-2">
                <span className="flex-shrink-0 w-2 h-2 rounded-full text-md sm:text-base leading-relaxed font-normal" />
                <span className="flex-1 text-md sm:text-base leading-relaxed font-normal">{p}</span>
              </li>
            ))}
          </ul>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{privacy.rights.contacttext}</p>
        </section>

        {/* Children */}
        <section className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
          <p className="flex items-center gap-3 text-md sm:text-base leading-relaxed mb-4 font-normal">
            <span className="text-md sm:text-base leading-relaxed font-normal">👶</span>
            {privacy.children.title}
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{privacy.children.text}</p>
        </section>

        {/* Changes */}
        <section className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
          <p className="flex items-center gap-3 text-md sm:text-base leading-relaxed mb-4 font-normal">
            <span className="text-md sm:text-base leading-relaxed font-normal">🔄</span>
            {privacy.changes.title}
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{privacy.changes.text}</p>
        </section>

        {/* Contact */}
        <section className="rounded-2xl p-4 md:p-8">
          <p className="flex items-center gap-3 text-md sm:text-base leading-relaxed mb-4 font-normal">
            <span className="text-md sm:text-base leading-relaxed font-normal">📧</span>
            {privacy.contact.title}
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{privacy.contact.lead}</p>
          <div className="space-y-2 text-md sm:text-base leading-relaxed font-normal">
            <p><strong className="text-amber-800">{privacy.contact.emaillabel}</strong> {privacy.contact.email}</p>
            <p><strong className="text-amber-800">{privacy.contact.websitelabel}</strong> {privacy.contact.website}</p>
          </div>
          <p className="pt-4 text-md sm:text-base leading-relaxed mb-4 font-normal">{privacy.contact.closing}</p>
        </section>
      </div>
    </PageLayout>
  );
}

