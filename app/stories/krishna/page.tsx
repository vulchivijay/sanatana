import PageLayout from '@components/common/PageLayout';

export default function Page() {
  return (
    <PageLayout title={'Krishna'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Stories' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/krishna</p>
    </PageLayout>
  );
}
