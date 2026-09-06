'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ClientRoadmapPage from '../[goalId]/roadmap/ClientRoadmapPage';
import { Loader2 } from 'lucide-react';

function RoadmapContent() {
  const searchParams = useSearchParams();
  const goalId = searchParams.get('goalId');
  return <ClientRoadmapPage goalId={goalId} />;
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className= flex items-center justify-center min-h-[50vh]>
        <Loader2 className=w-8 h-8 animate-spin text-emerald-600 />
      </div>
    }>
      <RoadmapContent />
    </Suspense>
  );
}
