import ClientStrategyPage from './ClientStrategyPage';
import { STRATEGY_REGISTRY } from "@/lib/data/strategyRegistry";

export function generateStaticParams() {
  return STRATEGY_REGISTRY.map(s => ({ slug: s.slug }));
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <ClientStrategyPage slug={resolvedParams?.slug} />;
}
