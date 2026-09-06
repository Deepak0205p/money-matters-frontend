import ClientTabPage from './ClientTabPage';

export function generateStaticParams() {
  return [
    { tab: 'dashboard' },
    { tab: 'goals' },
    { tab: 'chatbot' },
    { tab: 'bot' },
    { tab: 'gamified' },
    { tab: 'games' },
    { tab: 'learn' },
    { tab: 'tools' },
    { tab: 'history' },
    { tab: 'profile' },
    { tab: 'bookmarks' },
  ];
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <ClientTabPage tab={resolvedParams?.tab} />;
}
