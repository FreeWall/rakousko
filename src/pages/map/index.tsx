import dynamic from 'next/dynamic';
import React from 'react';


// Load MapWidget with SSR disabled because Leaflet requires the browser 'window' object
const MapWidget = dynamic(() => import('@/components/MapWidget'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[calc(100vh-180px)] flex-1 items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        <span className="text-xs font-medium text-slate-500">Načítám mapu...</span>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <>

      {/* Map Content */}
      <MapWidget />
    </>
  );
}
