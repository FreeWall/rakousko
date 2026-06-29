import L from 'leaflet';
import { Compass, ExternalLink, Home, MapPin, Navigation } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

import { destinations } from '@/lib/destinations';

// Approximate coordinates for Baranekhof Pension
const PENSION_COORDS: [number, number] = [47.2385075, 12.7314019];

// Destination list helper with coordinates added
const allPoints = [
  {
    id: 'pension_baranekhof',
    name: 'Pension Baranekhof (Ubytování)',
    type: 'Ubytování',
    description: 'Náš hlavní stan pro celou dovolenou.',
    coords: PENSION_COORDS,
    isHome: true,
  },
  ...destinations.map((d) => ({
    ...d,
    isHome: false,
  })),
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
      center: [47.25, 12.7],
      zoom: 12,
      zoomControl: false, // We will position it custom
    });

    mapRef.current = map;

    // Add Scale and Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const mapyCzOutdoor = L.tileLayer(
      'https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=BLJxiprIuc-CITOeX03d1Pa9mTRsfXtpCTurpviVl88',
      {
        minZoom: 0,
        maxZoom: 19,
        attribution:
          '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
      },
    );

    const mapyCzAerial = L.tileLayer(
      'https://api.mapy.cz/v1/maptiles/aerial/256/{z}/{x}/{y}?apikey=BLJxiprIuc-CITOeX03d1Pa9mTRsfXtpCTurpviVl88',
      {
        minZoom: 0,
        maxZoom: 19,
        attribution:
          '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
      },
    );

    const mapyCzNames = L.tileLayer(
      'https://api.mapy.cz/v1/maptiles/names-overlay/256/{z}/{x}/{y}?apikey=BLJxiprIuc-CITOeX03d1Pa9mTRsfXtpCTurpviVl88',
      {
        minZoom: 0,
        maxZoom: 19,
        attribution:
          '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
      },
    );

    const mapyCzHybrid = L.layerGroup([mapyCzAerial, mapyCzNames]);

    const googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps',
    });

    const googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps',
    });

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    // Default layer
    mapyCzOutdoor.addTo(map);

    const baseMaps = {
      'Mapy.cz Turistická': mapyCzOutdoor,
      'Mapy.cz Letecká (Hybrid)': mapyCzHybrid,
      'Google Mapa': googleStreets,
      'Google Satelitní': googleHybrid,
      OpenStreetMap: osm,
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
        iconAnchor: [16, 16],
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
  const handleSelectPoint = (point: (typeof allPoints)[0]) => {
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

  const selectedPoint = allPoints.find((p) => p.id === selectedDestId);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden bg-slate-50 font-sans md:flex-row">
      {/* Sidebar - Destinations List */}
      <div className="z-10 flex h-1/2 w-full shrink-0 flex-col border-r border-slate-200 bg-white shadow-md md:h-full md:w-96">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Compass className="animate-spin-slow h-5 w-5 text-emerald-600" />
            <h2 className="font-bold text-slate-800">Destinace a trasy</h2>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
            {allPoints.length} míst
          </span>
        </div>

        {/* List */}
        <div className="flex-1 space-y-1 divide-y divide-slate-100 overflow-y-auto p-2">
          {allPoints.map((point) => {
            const isSelected = point.id === selectedDestId;
            return (
              <button
                key={point.id}
                onClick={() => handleSelectPoint(point)}
                className={`group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950 shadow-sm'
                    : 'border-transparent text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  {point.isHome ? (
                    <Home className="h-5 w-5 text-rose-500" />
                  ) : (point as any).imageUrl ? (
                    <img
                      src={(point as any).imageUrl}
                      alt={point.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center justify-between gap-1">
                    <span className="block truncate font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      {point.type || 'Místo'}
                    </span>
                    {!point.isHome && (point as any).slCardInfo && (
                      <span className="py-0.2 shrink-0 rounded border border-blue-100 bg-blue-50 px-1 text-[9px] font-bold text-blue-700">
                        SL Card
                      </span>
                    )}
                  </div>
                  <h3 className="truncate text-xs leading-snug font-semibold text-slate-800">
                    {point.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-[11px] leading-normal text-slate-500">
                    {point.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail preview pane inside sidebar */}
        {selectedPoint && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-4">
            <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
              {!(selectedPoint as any).isHome && (selectedPoint as any).imageUrl && (
                <div className="relative h-28 w-full overflow-hidden rounded-lg border border-slate-100 bg-slate-100">
                  <img
                    src={(selectedPoint as any).imageUrl}
                    alt={selectedPoint.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <span className="mb-1 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {selectedPoint.type || 'Ubytování'}
                </span>
                <h3 className="text-sm leading-snug font-bold text-slate-900">
                  {selectedPoint.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {selectedPoint.description}
                </p>
              </div>

              {!selectedPoint.isHome && (
                <>
                  {/* Highlights */}
                  {(selectedPoint as any).highlights && (
                    <div className="space-y-1">
                      <span className="block font-mono text-[10px] font-bold text-slate-400 uppercase">
                        Hlavní highlights:
                      </span>
                      <ul className="space-y-1 pl-2 text-[11px] text-slate-600">
                        {(selectedPoint as any).highlights
                          .slice(0, 2)
                          .map((h: string, i: number) => (
                            <li
                              key={i}
                              className="list-disc leading-tight"
                            >
                              {h}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* Transport / dog details */}
                  {((selectedPoint as any).cableCarHours || (selectedPoint as any).dogPrice) && (
                    <div className="space-y-1 rounded-lg border border-slate-200/60 bg-slate-50 p-2 text-[10px] text-slate-700">
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
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 shadow-xs transition-colors hover:bg-emerald-50"
                      >
                        <Navigation className="h-3 w-3" /> Trasa
                      </a>
                    )}
                    {(selectedPoint as any).webUrl && (
                      <a
                        href={(selectedPoint as any).webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-200"
                      >
                        <ExternalLink className="h-3 w-3 text-slate-500" /> Web
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
      <div className="relative h-1/2 flex-1 md:h-full">
        {!isMapLoaded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
              <span className="text-xs font-medium text-slate-500">Načítám mapové podklady...</span>
            </div>
          </div>
        )}
        <div
          id="map-container"
          className="z-0 h-full w-full"
        />
      </div>
    </div>
  );
}
