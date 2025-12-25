import StructuredData from '@components/structured-data/StructuredData';
import HoroscopeClient from "./HoroscopeClient";

export const metadata = {
  title: "Horoscope",
};

export default function Page() {
  return (
    <>
      <StructuredData metaKey="about" />
      <main className="content-wrapper md page-space-xl">
        <h2>Horoscope Generator</h2>
        <HoroscopeClient />
      </main>
    </>
  );
}
