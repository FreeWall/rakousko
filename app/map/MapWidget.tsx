'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { destinations, Destination } from '@/lib/destinations';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  ExternalLink,
  Compass,
  Home,
  CheckCircle2,
  Info
} from 'lucide-react';
import Link from 'next/link';

// Approximate coordinates for Baranekhof Pension
const PENSION_COORDS: [number, number] = [47.2369, 12.7230];

// Destination list helper with coordinates added
const allPoints = [
  {
    id: 'pension_baranekhof',
    name: 'Pension Baranekhof (Ubytování)',
    type: 'Ubytování',
    description: 'Náš hlavní stan pro celou dovolenou.',
    coords: PENSION_COORDS,
    isHome: true
  },
  ...destinations.map(d => ({
    ...d,
    isHome: false
  }))
];

export default function MapWidget() {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [selectedDestId, setSelectedDestId] = useState<string>('pension_baranekhof');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Map
    const map = L.map('map-container', {
      center: [47.25, 12.70],
      zoom: 12,
      zoomControl: false // We will position it custom
    });

    mapRef.current = map;

    // Add Scale and Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    });

    const googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    });

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Default layer
    googleStreets.addTo(map);

    const baseMaps = {
      "Google Mapa": googleStreets,
      "Google Satelitní": googleHybrid,
      "OpenStreetMap": osm
    };

    L.control.layers(baseMaps, undefined, { position: 'topright' }).addTo(map);

    // Create markers for all points
    allPoints.forEach((point) => {
      if (!point.coords) return;

      const isHome = point.isHome;
      let colorClass = 'bg-emerald-500';
      let pingColorClass = 'bg-emerald-400';
      
      if (isHome) {
        colorClass = 'bg-rose-500';
        pingColorClass = 'bg-rose-400';
      } else if (point.type?.includes('Ledovec')) {
        colorClass = 'bg-cyan-500';
        pingColorClass = 'bg-cyan-400';
      } else if (point.type?.includes('Jezero') || point.type?.includes('Vodopády')) {
        colorClass = 'bg-blue-500';
        pingColorClass = 'bg-blue-400';
      } else if (point.type?.includes('Wellness')) {
        colorClass = 'bg-purple-500';
        pingColorClass = 'bg-purple-400';
      } else if (point.type?.includes('Zábava')) {
        colorClass = 'bg-amber-500';
        pingColorClass = 'bg-amber-400';
      }

      // Custom div icon with pulse effect
      const customIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <span class="absolute inline-flex h-6 w-6 animate-ping rounded-full ${pingColorClass} opacity-60"></span>
            <div class="relative flex items-center justify-center h-5 w-5 rounded-full ${colorClass} border-2 border-white shadow-md text-white">
              ${isHome ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-3 h-3"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' : '<div class="w-1.5 h-1.5 bg-white rounded-full"></div>'}
            </div>
          </div>
        `,
        className: 'custom-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(point.coords as [number, number], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedDestId(point.id);
          map.flyTo(point.coords as [number, number], 14, { duration: 1.2 });
        });

      // Bind a nice popup
      const popupContent = `
        <div class="p-1 max-w-xs font-sans">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">${point.type || 'Místo'}</span>
          </div>
          <h4 class="font-bold text-slate-900 text-sm leading-snug">${point.name}</h4>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">${point.description || ''}</p>
        </div>
      `;
      marker.bindPopup(popupContent, { closeButton: false });
      markersRef.current[point.id] = marker;
    });

    setIsMapLoaded(true);

    // Initial zoom fit or center on pension
    map.setView(PENSION_COORDS, 11);

    return () => {
      map.remove();
    };
  }, []);

  // Handle select destination from sidebar
  const handleSelectPoint = (point: typeof allPoints[0]) => {
    setSelectedDestId(point.id);
    if (mapRef.current && point.coords) {
      mapRef.current.flyTo(point.coords as [number, number], 14, { duration: 1.5 });
      
      // Open popup with slight delay to let flyTo finish
      setTimeout(() => {
        const marker = markersRef.current[point.id];
        if (marker) {
          marker.openPopup();
        }
      }, 1500);
    }
  };

  const selectedPoint = allPoints.find(p => p.id === selectedDestId);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar - Destinations List */}
      <div className="w-full md:w-96 flex flex-col border-r border-slate-200 bg-white shadow-md z-10 shrink-0 h-1/2 md:h-full">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600 animate-spin-slow" />
            <h2 className="font-bold text-slate-800 tracking-tight">Destinace a trasy</h2>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
            {allPoints.length} míst
          </span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {allPoints.map((point) => {
            const isSelected = point.id === selectedDestId;
            return (
              <button
                key={point.id}
                onClick={() => handleSelectPoint(point)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                  isSelected 
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 shadow-sm' 
                    : 'border-transparent hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  point.isHome 
                    ? 'bg-rose-100 text-rose-600' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {point.isHome ? <Home className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block truncate">
                      {point.type || 'Místo'}
                    </span>
                    {!point.isHome && (point as any).slCardInfo && (
                      <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1 py-0.2 rounded border border-blue-100 shrink-0">
                        SL Card
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-xs text-slate-800 leading-snug truncate">
                    {point.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-1 mt-0.5">
                    {point.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail preview pane inside sidebar */}
        {selectedPoint && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block mb-1">
                  {selectedPoint.type || 'Ubytování'}
                </span>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {selectedPoint.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {selectedPoint.description}
                </p>
              </div>

              {!selectedPoint.isHome && (
                <>
                  {/* Highlights */}
                  {(selectedPoint as any).highlights && (
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Hlavní highlights:</span>
                      <ul className="text-[11px] text-slate-600 space-y-1 pl-2">
                        {(selectedPoint as any).highlights.slice(0, 2).map((h: string, i: number) => (
                          <li key={i} className="list-disc leading-tight">{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Transport / dog details */}
                  {((selectedPoint as any).cableCarHours || (selectedPoint as any).dogPrice) && (
                    <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2 text-[10px] text-slate-700 space-y-1">
                      {(selectedPoint as any).cableCarHours && (
                        <div>
                          <strong>Provoz:</strong> {(selectedPoint as any).cableCarHours}
                        </div>
                      )}
                      {(selectedPoint as any).dogPrice && (
                        <div className="truncate">
                          <strong>Pes:</strong> {(selectedPoint as any).dogPrice}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    {(selectedPoint as any).mapyUrl && (
                      <a
                        href={(selectedPoint as any).mapyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-white text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors justify-center shadow-xs"
                      >
                        <Navigation className="w-3 h-3" /> Trasa
                      </a>
                    )}
                    {(selectedPoint as any).webUrl && (
                      <a
                        href={(selectedPoint as any).webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors justify-center border border-slate-200 shadow-xs"
                      >
                        <ExternalLink className="w-3 h-3 text-slate-500" /> Web
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map display */}
      <div className="flex-1 relative h-1/2 md:h-full">
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-slate-500 font-medium">Načítám mapové podklady...</span>
            </div>
          </div>
        )}
        <div id="map-container" className="w-full h-full z-0" />
      </div>
    </div>
  );
}
