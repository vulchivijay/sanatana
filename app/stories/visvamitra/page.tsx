import PageLayout from '@components/common/PageLayout';
import { t } from '../../../lib/i18n';


export default function Page() {
  const S = (k: string) => String(t(k));

  return (
    <PageLayout title={'Visvamitra'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/visvamitra</p>
    </PageLayout>
  );
}
