import ClientRoadmapPage from './ClientRoadmapPage';

export function generateStaticParams() {
  return [
    { goalId: 'emergency-fund' },
    { goalId: 'laptop' },
    { goalId: 'bike' },
    { goalId: 'trip' },
    { goalId: 'investment' },
    { goalId: 'custom' },
  ];
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <ClientRoadmapPage goalId={resolvedParams?.goalId} />;
}
