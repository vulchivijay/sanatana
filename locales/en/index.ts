// Auto-generated index for locale 'am'
// Imports all JSON files in this folder and deep-merges them into one export.
import _0 from './about.json';
import _1 from './adisankaraStory.json';
import _2 from './advaitaPhilosophy.json';
import _3 from './bannerNotifications.json';
import _4 from './bannerNotifications2.json';
import _5 from './bhagavadgita.json';
import _6 from './bhishmaStory.json';
import _7 from './bramhaStory.json';
import _8 from './categories.json';
import _9 from './comics.json';
import _10 from './contactForm.json';
import _11 from './contactPage.json';
import _12 from './cookieConsent.json';
import _13 from './cookiepolicy.json';
import _14 from './cta.json';
import _15 from './dailypoojasPractices.json';
import _16 from './dailyprayers_stotras.json';
import _17 from './devistotras.json';
import _18 from './dharmaPhilosophy.json';
import _19 from './donate.json';
import _20 from './festivalPractices.json';
import _21 from './footer.json';
import _22 from './ganeshstotras.json';
import _23 from './hanumanstotras.json';
import _24 from './home.json';
import _25 from './horoscope.json';
import _26 from './illustratedstories.json';
import _27 from './karmaPhilosophy.json';
import _28 from './karnaStory.json';
import _29 from './krishnaStory.json';
import _30 from './lakshmiStory.json';
import _31 from './languageDropdown.json';
import _32 from './mahabharata.json';
import _33 from './mayaAvidyaPhilosophy.json';
import _34 from './meta.json';
import _35 from './mokshaPhilosophy.json';
import _36 from './mythologicalquizzes.json';
import _37 from './nav.json';
import _38 from './parashuramaStory.json';
import _39 from './parvathiStory.json';
import _40 from './policies.json';
import _41 from './privacy.json';
import _42 from './privacypolicy.json';
import _43 from './puranas.json';
import _44 from './purusharthaPhilosophy.json';
import _45 from './questions.json';
import _46 from './quiz.json';
import _47 from './ramanamaharshiStory.json';
import _48 from './ramayana.json';
import _49 from './ritualsPractices.json';
import _50 from './samsaraPhilosophy.json';
import _51 from './sankshepaRamayana.json';
import _52 from './saraswathiStory.json';
import _53 from './scrollToTop.json';
import _54 from './shivaStory.json';
import _55 from './shivastotras.json';
import _56 from './siteTitle.json';
import _57 from './slugPage.json';
import _58 from './terms.json';
import _59 from './timeline.json';
import _60 from './upanishads.json';
import _61 from './vasistaStory.json';
import _62 from './vastuPractices.json';
import _63 from './vedas.json';
import _64 from './vedasPage1.json';
import _65 from './vishnuStory.json';
import _66 from './vishnustotras.json';
import _67 from './vishwamitraStory.json';
import _68 from './yogaPhilosophy.json';

function deepMerge(target: any, source: any) {
  if (source === undefined) return target;
  if (Array.isArray(target) && Array.isArray(source)) {
    const out = target.slice();
    for (let i = 0; i < source.length; i++) out[i] = deepMerge(out[i], source[i]);
    return out;
  }
  if (target && typeof target === 'object' && source && typeof source === 'object') {
    const out = { ...target };
    for (const k of Object.keys(source)) out[k] = deepMerge(target[k], source[k]);
    return out;
  }
  return source;
}

const base = {};
const merged = [_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68].reduce((acc, cur) => deepMerge(acc, cur || {}), base);

export default merged;
