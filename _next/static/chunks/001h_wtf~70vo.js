(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,3303,(e,t,n)=>{t.exports=e.r(79520)},48580,e=>{"use strict";var t=e.i(43476),n=e.i(71645),o=e.i(3303),a=e.i(56563);function i(){try{let e=a.default.getItem("sd_cookie_prefs");if(!e)return!1;let t=JSON.parse(e);return!!((null==t?void 0:t.performance)||(null==t?void 0:t.targeting))}catch{return!1}}e.s(["default",0,function(e){let{gaId:a,gtmId:r}=e,[d,s]=(0,n.useState)(!1),[l,w]=(0,n.useState)(!1);if((0,n.useEffect)(()=>{s(i());let e=()=>s(i());return window.addEventListener("sd_cookie_prefs_updated",e),()=>window.removeEventListener("sd_cookie_prefs_updated",e)},[]),(0,n.useEffect)(()=>{let e,t;if(!d)return void w(!1);let n=!1,o=()=>{n||(n=!0,w(!0),window.removeEventListener("pointerdown",o),window.removeEventListener("keydown",o),window.removeEventListener("scroll",o))};return window.addEventListener("pointerdown",o,{once:!0,passive:!0}),window.addEventListener("keydown",o,{once:!0}),window.addEventListener("scroll",o,{once:!0,passive:!0}),"function"==typeof window.requestIdleCallback?t=window.requestIdleCallback(()=>o(),{timeout:5e3}):e=window.setTimeout(()=>o(),5e3),()=>{e&&window.clearTimeout(e),t&&"function"==typeof window.cancelIdleCallback&&window.cancelIdleCallback(t),window.removeEventListener("pointerdown",o),window.removeEventListener("keydown",o),window.removeEventListener("scroll",o)}},[d]),!d||!l)return null;let c=!!r;return(0,t.jsxs)(t.Fragment,{children:[!!a&&!c&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.default,{src:`https://www.googletagmanager.com/gtag/js?id=${a}`,strategy:"lazyOnload"}),(0,t.jsx)(o.default,{id:"ga-init",strategy:"lazyOnload",children:`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${a}', {
                page_path: window.location.pathname,
              });
            `})]}),c&&(0,t.jsx)(o.default,{id:"gtm-init",strategy:"lazyOnload",children:`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${r}');
          `})]})}])},80140,e=>{e.n(e.i(48580))}]);