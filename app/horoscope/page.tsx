import StructuredData from '@components/structured-data/StructuredData';
import HoroscopeClient from "./HoroscopeClient";
import PageLayout from '@components/common/PageLayout';

export const metadata = {
  title: "Horoscope",
};

export default function Page() {
  return (
    <>
      <StructuredData metaKey="about" />
      <PageLayout className="content-wrapper md page-space-xl" title={'Horoscope Generator'}>
        <HoroscopeClient />
      </PageLayout>
    </>
  );
}
