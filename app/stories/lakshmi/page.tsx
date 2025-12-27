import PageLayout from '@components/common/PageLayout';
import { t } from '../../../lib/i18n';


export default function Page() {
  const S = (k: string) => String(t(k));

  return (
    <PageLayout title={'Lakshmi'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Lakshmi' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/lakshmi</p>
    </PageLayout>
  );
}
