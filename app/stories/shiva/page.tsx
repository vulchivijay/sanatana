import PageLayout from '@components/common/PageLayout';
import { t } from '../../../lib/i18n';


export default function Page() {
  const S = (k: string) => String(t(k));

  return (
    <PageLayout title={'Shiva'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Shiva' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/shiva</p>
    </PageLayout>
  );
}
