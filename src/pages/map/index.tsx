import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  Mountain, 
  MapPin, 
  Sparkles,
  Calendar,
  Compass,
  CreditCard,
  Map,
  ArrowLeft
} from 'lucide-react';

// Load MapWidget with SSR disabled because Leaflet requires the browser 'window' object
const MapWidget = dynamic(() => import('@/components/MapWidget'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-slate-100 min-h-[calc(100vh-180px)]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-500 font-medium">Načítám mapu...</span>
      </div>
    </div>
  )
});

export default function MapPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Brand Banner & Info */}
      <header className="bg-slate-900 text-white border-b border-slate-800 py-5 px-4 md:px-8 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between relative z-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors mr-1"
                title="Zpět na přehled"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Mountain className="w-3 h-3" /> Rakousko &bull; Kaprun 2026
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-white mb-0.5">
              Interaktivní Mapa Destinací
            </h1>
            <p className="text-slate-400 text-xs flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Vizualizace všech plánovaných míst a ubytování na mapě
            </p>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-2 md:px-8 py-2.5 overflow-x-auto scrollbar-none flex justify-start md:justify-center shrink-0">
        <div className="flex gap-1.5 max-w-4xl w-full">
          <Link
            id="tab_overview"
            href="/?tab=overview"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 border bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Calendar className="w-4 h-4" /> Program & Info
          </Link>
          <Link
            id="tab_hikes"
            href="/?tab=hikes"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 border bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Compass className="w-4 h-4" /> Trasy Mapy.cz
          </Link>
          <Link
            id="tab_card"
            href="/?tab=card"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 border bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <CreditCard className="w-4 h-4" /> Salzburger Card
          </Link>
          <Link
            id="tab_ai"
            href="/?tab=ai"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 border bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" /> AI Průvodce
          </Link>
          <div
            id="tab_map"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 border bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
          >
            <Map className="w-4 h-4 text-emerald-600" /> Mapa destinací
          </div>
        </div>
      </nav>

      {/* Map Content */}
      <MapWidget />
    </div>
  );
}
