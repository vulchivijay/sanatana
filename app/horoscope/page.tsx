
import HoroscopeClient from './HoroscopeClient';
import PageLayout from '@components/common/PageLayout';
import { t } from '../../lib/i18n';

export const metadata = {
  title: "Horoscope",
};

export default function Page() {
  const S = (k: string) => String(t(k));
  const title = 'Horoscope Generator';

  return (
    <>
      <PageLayout title={'Horoscope Generator'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]}>
        <HoroscopeClient />
      </PageLayout>
    </>
  );
}
