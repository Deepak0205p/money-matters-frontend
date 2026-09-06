import ClientModulePage from './ClientModulePage';
import { modules } from '@/data/modulesIndex';

export function generateStaticParams() {
  return modules.map(m => ({ id: String(m.id) }));
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <ClientModulePage moduleId={Number(resolvedParams?.id)} />;
}
