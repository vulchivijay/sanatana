"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from '@lib/parse';
import FaqAccordion from '@/app/components/faqaccordion';
import Loader from '@components/loader';
import LazyImage from '@components/lazyimage';

type Props = {
  initialTitle?: string;
};

type PurposeContent = {
  heading: string;
  points: string[];
};

type ExpenseRow = {
  name: string;
  cost: string;
  cycle: string;
  provider: string;
};

type DonationRow = {
  sourceFile?: string;
  date: string;
  amountDonate: string;
  toWhom: string;
  donatedBy: string;
};

const DEFAULT_DONOR_NAME = 'Mrs. Vulchi Vijaya Kumar';
const DEFAULT_DATE = 'Unknown Date';
const DEFAULT_AMOUNT = 'Unknown Amount';
const DEFAULT_RECIPIENT = 'Unknown Recipient';

function normalizeDonationValue(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\s+/g, ' ').trim();
}

function normalizeDonationDate(value: unknown): string {
  const normalized = normalizeDonationValue(value);
  if (!normalized) {
    return '';
  }

  const patterns = [
    /\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/i,
    /\b\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2}\b/i,
    /\b\d{1,2}-[A-Za-z]{3,9}-\d{2,4}\b/i,
    /\b[A-Za-z]{3,9}\s+\d{1,2},\s*\d{4}\b/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match && match[0]) {
      return normalizeDonationValue(match[0]);
    }
  }

  return '';
}

function normalizeDonationAmount(value: unknown): string {
  const normalized = normalizeDonationValue(value);
  if (!normalized) {
    return '';
  }

  const match = normalized.match(/((?:INR|Rs\.?|USD|EUR|GBP|AUD|CAD|\$|₹|€|£)\s?[\d,]+(?:\.\d{2})?|[\d,]+(?:\.\d{2})?)/i);
  return match && match[1] ? normalizeDonationValue(match[1]) : '';
}

function isLikelyDonationDonor(value: string): boolean {
  if (!value) {
    return false;
  }

  if (/^img[_\s-]?\d+/i.test(value)) {
    return false;
  }

  if (/\d/.test(value) && !/^m(?:rs|r|s)\.?\s/i.test(value)) {
    return false;
  }

  const words = value.match(/[A-Za-z]+/g) || [];
  return words.length >= 2;
}

function normalizeDonationDonor(value: unknown): string {
  const normalized = normalizeDonationValue(value);
  return isLikelyDonationDonor(normalized) ? normalized : DEFAULT_DONOR_NAME;
}

function sanitizeDonationRows(rows: unknown): DonationRow[] {
  if (!Array.isArray(rows)) {
    return [];
  }

  const uniqueRows: DonationRow[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const candidate = row as Partial<DonationRow>;
    const normalized: DonationRow = {
      sourceFile: normalizeDonationValue(candidate.sourceFile),
      date: normalizeDonationDate(candidate.date) || DEFAULT_DATE,
      amountDonate: normalizeDonationAmount(candidate.amountDonate) || DEFAULT_AMOUNT,
      toWhom: normalizeDonationValue(candidate.toWhom) || DEFAULT_RECIPIENT,
      donatedBy: normalizeDonationDonor(candidate.donatedBy),
    };

    const key = normalized.sourceFile || `${normalized.date.toLowerCase()}|${normalized.amountDonate.toLowerCase()}|${normalized.toWhom.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueRows.push(normalized);
  }

  return uniqueRows;
}

type FaqItem = {
  q: string;
  a: string;
};

type DonateState = {
  title: string;
  subtitle: string;
  purpose: PurposeContent;
  expenses: {
    heading: string;
    table: ExpenseRow[];
  };
  donateOptions: {
    oneTime?: {
      heading?: string;
      note?: string;
    };
  };
  faq: {
    heading: string;
    items: FaqItem[];
  };
};

export default function DonateClient({ initialTitle = '' }: Props) {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('donate');

  // Initialize with empty state to avoid hydration mismatch
  const [donate, setDonate] = useState<DonateState>({
    title: initialTitle,
    subtitle: '',
    purpose: { heading: '', points: [] },
    expenses: { heading: '', table: [] },
    donateOptions: {},
    faq: { heading: '', items: [] },
  });
  const [donationRows, setDonationRows] = useState<DonationRow[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Locale loading is now handled by context/useLocaleSection
      } catch (e) { }

      if (!mounted) return;
      const title = ns?.title || initialTitle;
      const subtitle = ns?.subtitle || '';

      const rawPurpose = parseMaybeObject(ns ? ns.purpose : '');
      const rawExpenses = parseMaybeObject(ns ? ns.expenses : '');
      const donateOptions = parseMaybeObject(ns ? ns.donateOptions : '');
      const rawFaq = parseMaybeObject(ns ? ns.faq : '');

      const purpose = (rawPurpose && typeof rawPurpose === 'object')
        ? { heading: rawPurpose.heading, points: parseSections(rawPurpose.points) }
        : { heading: '', points: parseSections(rawPurpose) };

      const expenses = (rawExpenses && typeof rawExpenses === 'object')
        ? {
            heading: rawExpenses.heading || '',
            table: Array.isArray(rawExpenses.table)
              ? rawExpenses.table.filter((row: unknown): row is ExpenseRow => {
                  if (!row || typeof row !== 'object') return false;
                  const r = row as Record<string, unknown>;
                  return (
                    typeof r.name === 'string' &&
                    typeof r.cost === 'string' &&
                    typeof r.cycle === 'string' &&
                    typeof r.provider === 'string'
                  );
                })
              : [],
          }
        : { heading: '', table: [] };

      const faq = (rawFaq && typeof rawFaq === 'object')
        ? {
          heading: rawFaq.heading || '',
          items: Array.isArray(rawFaq.items)
            ? rawFaq.items.filter((item: unknown): item is FaqItem => {
              return Boolean(
                item
                && typeof item === 'object'
                && 'q' in item
                && 'a' in item
                && typeof item.q === 'string'
                && typeof item.a === 'string'
              );
            })
            : [],
        }
        : { heading: '', items: [] };

      setDonate({ title, subtitle, purpose, expenses, donateOptions, faq });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  useEffect(() => {
    let cancelled = false;

    fetch('/data/donations.generated.json')
      .then(async (response) => {
        if (!response.ok) {
          return [] as DonationRow[];
        }

        return response.json() as Promise<DonationRow[]>;
      })
      .then((payload) => {
        if (cancelled) {
          return;
        }

        setDonationRows(sanitizeDonationRows(payload));
      })
      .catch(() => {
        if (!cancelled) {
          setDonationRows([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading && !donate.title) {
    return (
      <PageLayout metaKey="donate" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Donate' }]} className="layout-sm">
        <div className="flex items-center justify-center py-6 text-md sm:text-base leading-relaxed font-normal">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="donate"
      title={donate.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Donate' }]}
      className={`layout-sm`}
    >
      <div id="donate-content" className="space-y-12 text-md sm:text-base leading-relaxed font-normal">
        <div className="text-center max-w-3xl mx-auto text-md sm:text-base leading-relaxed font-normal">
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{donate.subtitle}</p>
        </div>

        {/* Purpose */}
        <section className="relative">
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-2xl shadow-sm border border-amber-200 p-5 overflow-hidden text-md sm:text-base leading-relaxed font-normal">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-100 rounded-full blur-3xl text-md sm:text-base leading-relaxed font-normal" />
            <div className="relative z-10 text-md sm:text-base leading-relaxed font-normal">
              <div className="flex items-center gap-3 text-md sm:text-base leading-relaxed font-normal">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-sm text-md sm:text-base leading-relaxed font-normal">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold leading-snug mb-2">{donate.purpose?.heading}</h3>
              </div>
              <ul className="space-y-4 list-disc pl-5 text-md sm:text-base leading-relaxed mt-6">
                {(donate.purpose?.points || []).map((p: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 group mb-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200 text-md sm:text-base leading-relaxed font-normal">
                      {i + 1}
                    </span>
                    <span className="flex-1 pt-1 text-md sm:text-base leading-relaxed font-normal">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Donation receipts */}
        <section className="relative">
          <div className="text-center text-md sm:text-base leading-relaxed font-normal">
            <h4 className="text-md sm:text-base md:text-2xl font-semibold text-gray-900 inline-block">{donate.expenses?.heading}</h4>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full text-md sm:text-base leading-relaxed font-normal"></div>
          </div>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-amber-200 text-md sm:text-base leading-relaxed font-normal">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">Item</th>
                  <th className="p-4 text-left font-semibold">Cost</th>
                  <th className="p-4 text-left font-semibold">Cycle</th>
                  <th className="p-4 text-left font-semibold">Provider</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {(donate.expenses?.table || []).map((row: ExpenseRow, i: number) => (
                  <tr key={i} className="border-t border-amber-100 hover:bg-amber-50 transition-colors duration-200">
                    <td className="p-4 font-medium text-gray-900">{row.name}</td>
                    <td className="p-4 text-amber-800 font-semibold">{row.cost}</td>
                    <td className="p-4">{row.cycle}</td>
                    <td className="p-4">{row.provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-amber-200 text-md sm:text-base leading-relaxed font-normal mt-12">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">Date</th>
                  <th className="p-4 text-left font-semibold">Amount Donated</th>
                  <th className="p-4 text-left font-semibold">To Whom</th>
                  <th className="p-4 text-left font-semibold">Sponsor Name</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {donationRows.map((row) => (
                  <tr key={`${row.date}-${row.amountDonate}-${row.donatedBy}`} className="border-t border-amber-100 hover:bg-amber-50 transition-colors duration-200 align-top">
                    <td className="p-4 font-medium text-gray-900">{row.date || '-'}</td>
                    <td className="p-4 text-amber-800 font-semibold">{row.amountDonate || '-'}</td>
                    <td className="p-4">{row.toWhom || '-'}</td>
                    <td className="p-4">{row.donatedBy || '-'}</td>
                  </tr>
                ))}
                {donationRows.length === 0 ? (
                  <tr className="border-t border-amber-100">
                    <td className="p-4 text-gray-600" colSpan={4}>No donation receipt data is available yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        {/* Donate */}
        <section className="relative">
          <div className="bg-gradient-to-br from-white via-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 p-5 overflow-hidden text-md sm:text-base leading-relaxed font-normal">
            <div className="absolute inset-0 opacity-40 text-md sm:text-base leading-relaxed font-normal" aria-hidden="true" />
            <div className="relative z-10 text-md sm:text-base leading-relaxed font-normal">
              <div className="text-center text-md sm:text-base leading-relaxed font-normal">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-sm text-md sm:text-base leading-relaxed font-normal">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h5 className="text-3xl font-semibold text-amber-900 mb-3">{donate.donateOptions?.oneTime?.heading}</h5>
                <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{donate.donateOptions?.oneTime?.note}</p>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 my-10 text-md sm:text-base leading-relaxed font-normal">
                <div className="group text-md sm:text-base leading-relaxed font-normal">
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-amber-200 hover:border-amber-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-sm text-md sm:text-base leading-relaxed font-normal">
                    <div className="text-center text-md sm:text-base leading-relaxed font-normal">
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-md sm:text-base leading-relaxed font-normal">PayPal</span>
                    </div>
                    <LazyImage
                      src="/images/SANATANADHARM-qrcode.png"
                      alt="PayPal QR Code"
                      width={200}
                      height={205}
                      className="rounded-2xl shadow-sm"
                    />
                    <div className="text-md sm:text-base leading-relaxed font-normal">
                      <LazyImage
                        src="/images/Debit_Credit_APM.svg"
                        alt="PayPal QR Code Logo"
                        width={150}
                        height={45}
                        className="mx-auto"
                      />
                    </div>
                  </div>
                </div>

                <div className="group text-md sm:text-base leading-relaxed font-normal">
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-amber-200 hover:border-amber-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-sm text-md sm:text-base leading-relaxed font-normal">
                    <div className="text-center text-md sm:text-base leading-relaxed font-normal">
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-md sm:text-base leading-relaxed font-normal">UPI</span>
                    </div>
                    <LazyImage
                      src="/images/UPI-qrcode.png"
                      alt="UPI QR Code"
                      width={200}
                      height={200}
                      className="rounded-2xl shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <div>
          <FaqAccordion items={(donate.faq?.items || [])} heading={donate.faq?.heading} />
        </div>

        {/* Similar Categories */}
        {/* <SimilarCategories 
          title="Explore More Topics"
          maxItems={3}
        /> */}
      </div>
    </PageLayout>
  );
}

