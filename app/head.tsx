export default function Head() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SanatanaDharmam",
    url: "https://sanatanadharmam.in",
    logo: "https://sanatanadharmam.in/og/logo.png"
  };

  return (
    <>
      <meta name="google-site-verification" content="kxWcUTvXW7Ag5H1jtSxNuYUoKcWm-sq0on2s-h5ILF8" />
      <meta name="robots" content="index, follow" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
