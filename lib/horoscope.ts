// Lightweight astrology utilities — no external libs
// Provides sun-sign detection and deterministic horoscopes for day/week/month

function hashString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getSunSign(dateInput: string | Date): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : new Date(dateInput);
  const m = d.getUTCMonth() + 1; // 1-12
  const day = d.getUTCDate();

  const ranges = [
    { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
    { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces', start: [2, 19], end: [3, 20] },
    { sign: 'Aries', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
  ];

  for (const r of ranges) {
    const [sM, sD] = r.start;
    const [eM, eD] = r.end;
    let inRange = false;
    if (sM === eM) {
      inRange = m === sM && day >= sD && day <= eD;
    } else if (sM > eM) {
      // wrap around year end
      inRange = (m === sM && day >= sD) || (m === eM && day <= eD) || (m > sM || m < eM);
    } else {
      inRange = (m > sM || (m === sM && day >= sD)) && (m < eM || (m === eM && day <= eD));
    }
    if (inRange) return r.sign;
  }
  return 'Unknown';
}

const planetForSign: Record<string, string> = {
  Aries: '♂',
  Taurus: '♀',
  Gemini: '☿',
  Cancer: '☾',
  Leo: '☉',
  Virgo: '☿',
  Libra: '♀',
  Scorpio: '♇',
  Sagittarius: '♃',
  Capricorn: '♄',
  Aquarius: '♅',
  Pisces: '♆',
};

function pick(rnd: () => number, arr: string[]) {
  return arr[Math.floor(rnd() * arr.length)];
}

function startOfWeekIso(date: Date) {
  // compute Monday of the week (ISO)
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay(); // 0 Sun .. 6 Sat
  const diff = (day + 6) % 7; // days since Monday
  d.setUTCDate(d.getUTCDate() - diff);
  return d.toISOString().slice(0, 10);
}

export type Period = 'day' | 'week' | 'month';

export function generateHoroscope(birthDateIso: string, name?: string, period: Period = 'day', seedDate?: string) {
  const date = seedDate ? new Date(seedDate) : new Date();

  let periodSeed: string;
  let label: string;
  if (period === 'day') {
    periodSeed = date.toISOString().slice(0, 10);
    label = periodSeed;
  } else if (period === 'week') {
    const monday = startOfWeekIso(date);
    periodSeed = monday;
    const mondayDate = new Date(monday + 'T00:00:00Z');
    const sunday = new Date(mondayDate);
    sunday.setUTCDate(sunday.getUTCDate() + 6);
    label = `${monday} — ${sunday.toISOString().slice(0, 10)}`;
  } else {
    const ym = date.toISOString().slice(0, 7); // YYYY-MM
    periodSeed = ym;
    label = ym;
  }

  const baseSeed = `${birthDateIso}|${name || ''}|${period}|${periodSeed}`;
  const rnd = mulberry32(hashString(baseSeed));

  const sign = getSunSign(birthDateIso);
  const planet = planetForSign[sign] ?? '';

  const intros = [
    `A reflective energy accompanies you${name ? `, ${name}` : ''}.`,
    'Circumstances invite a fresh perspective.',
    'Your focus will bring subtle but useful shifts.',
    'This period favors steady, considered steps.',
  ];
  const actions = [
    'Prioritize rest and recovery when possible.',
    'Reach out to a supportive contact.',
    'Break a large task into small clear steps.',
    'Take a moment to plan instead of rushing.',
  ];
  const outcomes = [
    'Progress builds quietly beneath the surface.',
    'An opportunity appears from an unexpected quarter.',
    'Consistency will compound into visible gains.',
    'A resolved conversation brings relief.',
  ];

  const text = `${pick(rnd, intros)} ${pick(rnd, actions)} ${pick(rnd, outcomes)}`;
  const luckyNumber = 1 + Math.floor(rnd() * 99);

  return { sign, planet, text, luckyNumber, period, periodLabel: label };
}

export function generateDailyHoroscope(birthDateIso: string, name?: string) {
  return generateHoroscope(birthDateIso, name, 'day');
}
