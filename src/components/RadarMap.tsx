import L from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { Activity, RefreshCw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';

import { destinations } from '@/lib/destinations';
import 'leaflet/dist/leaflet.css';

L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);

interface TimelineStep {
  index: number;
  label: string;
  type: 'past' | 'now' | 'forecast';
  url: string;
  time: Date;
}

export default function RadarMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.ImageOverlay | null>(null);

  const [baseDate, setBaseDate] = useState<Date | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Automatically refresh radar data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 1. Radar URL fetching & base time resolution logic
  useEffect(() => {
    let active = true;
    setLoading(true);
    const maxRetries = 5; // Try up to 25 minutes ago (5 slots of 5m)

    const tryLoadImage = (offsetMinutes: number) => {
      if (offsetMinutes >= maxRetries * 5) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      const now = new Date();
      // Start with the retry offset
      const targetTime = new Date(now.getTime() - offsetMinutes * 60 * 1000);

      // Round down to the nearest 5-minute slot
      const minutes = targetTime.getUTCMinutes();
      const roundedMinutes = Math.floor(minutes / 5) * 5;
      targetTime.setUTCMinutes(roundedMinutes);
      targetTime.setUTCSeconds(0);
      targetTime.setUTCMilliseconds(0);

      const year = targetTime.getUTCFullYear();
      const month = String(targetTime.getUTCMonth() + 1).padStart(2, '0');
      const day = String(targetTime.getUTCDate()).padStart(2, '0');
      const hour = String(targetTime.getUTCHours()).padStart(2, '0');
      const minute = String(targetTime.getUTCMinutes()).padStart(2, '0');

      const url = `https://www.in-pocasi.cz/data/dwd_radar_v3/${year}${month}${day}_${hour}${minute}_r_de.png`;

      const img = new Image();
      img.onload = () => {
        if (!active) return;
        setBaseDate(targetTime);
        setLoading(false);
      };
      img.onerror = () => {
        if (!active) return;
        // Try the previous 5-minute slot
        tryLoadImage(offsetMinutes + 5);
      };
      img.src = url;
    };

    tryLoadImage(1);

    return () => {
      active = false;
    };
  }, [refreshKey]);

  // Generate the timeline steps based on resolved base date
  const timeline = React.useMemo<TimelineStep[]>(() => {
    if (!baseDate) return [];

    const steps: TimelineStep[] = [];

    // 12 past steps (-12 to -1)
    for (let i = -12; i < 0; i++) {
      const offset = Math.abs(i) * 5;
      const targetTime = new Date(baseDate.getTime() - offset * 60 * 1000);

      const year = targetTime.getUTCFullYear();
      const month = String(targetTime.getUTCMonth() + 1).padStart(2, '0');
      const day = String(targetTime.getUTCDate()).padStart(2, '0');
      const hour = String(targetTime.getUTCHours()).padStart(2, '0');
      const minute = String(targetTime.getUTCMinutes()).padStart(2, '0');

      steps.push({
        index: i,
        label: targetTime.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
        type: 'past',
        url: `https://www.in-pocasi.cz/data/dwd_radar_v3/${year}${month}${day}_${hour}${minute}_r_de.png`,
        time: targetTime,
      });
    }

    // Now step (0)
    const baseYear = baseDate.getUTCFullYear();
    const baseMonth = String(baseDate.getUTCMonth() + 1).padStart(2, '0');
    const baseDay = String(baseDate.getUTCDate()).padStart(2, '0');
    const baseHour = String(baseDate.getUTCHours()).padStart(2, '0');
    const baseMinute = String(baseDate.getUTCMinutes()).padStart(2, '0');
    steps.push({
      index: 0,
      label: baseDate.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
      type: 'now',
      url: `https://www.in-pocasi.cz/data/dwd_radar_v3/${baseYear}${baseMonth}${baseDay}_${baseHour}${baseMinute}_r_de.png`,
      time: baseDate,
    });

    // 11 forecast steps (1 to 11)
    for (let i = 1; i <= 11; i++) {
      const targetTime = new Date(baseDate.getTime() + i * 5 * 60 * 1000);
      steps.push({
        index: i,
        label: targetTime.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
        type: 'forecast',
        url: `https://www.in-pocasi.cz/data/dwd_radar_v3/pred_${i - 1}.png?${Math.floor(new Date().getTime() / 1000)}`,
        time: targetTime,
      });
    }

    return steps;
  }, [baseDate]);

  const activeStep = React.useMemo(() => {
    return timeline.find((s) => s.index === activeIndex) || null;
  }, [timeline, activeIndex]);

  const activeRadarUrl = activeStep ? activeStep.url : null;
  const activeRadarDate = activeStep ? activeStep.time : null;

  // Preload all timeline images
  useEffect(() => {
    if (timeline.length === 0) return;
    timeline.forEach((step) => {
      const img = new Image();
      img.src = step.url;
    });
  }, [timeline]);

  // Reset index on base date update
  useEffect(() => {
    setActiveIndex(0);
  }, [baseDate]);

  // 2. Map initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center coordinates: between Zell am See and Kaprun
    const centerCoords: [number, number] = [47.28, 12.76];

    const map = L.map(mapContainerRef.current, {
      center: centerCoords,
      zoom: 8,
      zoomControl: false,
      attributionControl: false,
      gestureHandling: true,
    } as any);
    mapRef.current = map;

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add markers for all destinations from destinations.ts
    destinations.forEach((d) => {
      if (!d.coords) return;
      const marker = L.marker(d.coords, {
        icon: L.divIcon({
          className: 'custom-radar-marker cursor-pointer',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-blue-400 opacity-60"></span>
              <div class="relative h-2.5 w-2.5 rounded-full bg-blue-500 border border-white shadow-sm"></div>
            </div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      })
        .addTo(map)
        .bindTooltip(d.name, {
          permanent: false,
          direction: 'top',
          className:
            'bg-slate-900 border-none text-white text-[10px] px-1.5 py-0.5 rounded shadow font-semibold',
        });

      marker.on('click', () => {
        map.panTo(d.coords!);
      });
    });

    // Add marker for Pension Baranekhof
    const pensionMarker = L.marker([47.2385075, 12.7314019], {
      icon: L.divIcon({
        className: 'custom-radar-marker-pension cursor-pointer',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-rose-400 opacity-60"></span>
            <div class="relative h-2.5 w-2.5 rounded-full bg-rose-500 border border-white shadow-sm"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    })
      .addTo(map)
      .bindTooltip('Pension Baranekhof', {
        permanent: false,
        direction: 'top',
        className:
          'bg-slate-900 border-none text-white text-[10px] px-1.5 py-0.5 rounded shadow font-semibold',
      });

    pensionMarker.on('click', () => {
      map.panTo([47.2385075, 12.7314019]);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 3. Radar layer update
  useEffect(() => {
    if (!mapRef.current || !activeRadarUrl) return;

    // Geographic bounding box for the DWD radar image overlay
    const bounds: L.LatLngBoundsExpression = [
      [46.1917, 3.0888],
      [55.7838, 17.0972],
    ];

    if (!overlayRef.current) {
      const overlay = L.imageOverlay(activeRadarUrl, bounds, {
        opacity: 0.8,
        interactive: false,
      }).addTo(mapRef.current);
      overlayRef.current = overlay;
    } else {
      overlayRef.current.setUrl(activeRadarUrl);
    }
  }, [activeRadarUrl]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="relative mt-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-900/50 shadow-inner">
      {/* Header Overlay */}
      <div className="absolute top-2 left-2 z-10 flex flex-wrap items-center gap-2 rounded-lg bg-slate-900/90 px-3 py-1.5 text-xs text-white shadow backdrop-blur-xs">
        <Activity
          className={`h-3.5 w-3.5 ${
            activeIndex > 0
              ? 'text-amber-500'
              : activeIndex === 0
                ? 'animate-pulse text-emerald-400'
                : 'text-slate-400'
          }`}
        />
        {activeRadarDate && (
          <span className="text-xs font-semibold text-slate-300">
            {activeRadarDate.toLocaleString('cs-CZ', {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {activeIndex > 0 && (
              <span className="ml-1.5 text-[10px] font-bold tracking-wide text-amber-500 uppercase">
                Předpověď
              </span>
            )}
            {activeIndex < 0 && (
              <span className="ml-1.5 text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                Historie
              </span>
            )}
            {activeIndex === 0 && (
              <span className="ml-1.5 text-[10px] font-bold tracking-wide text-emerald-500 uppercase">
                Aktuální
              </span>
            )}
          </span>
        )}
        {loading && <RefreshCw className="h-3 w-3 animate-spin text-slate-400" />}
      </div>

      {/* Control Overlay (Refresh) */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleRefresh}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900/90 text-white shadow backdrop-blur-xs transition hover:bg-slate-800"
          title="Obnovit radar"
          disabled={loading}
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="h-96 w-full pb-14 md:pb-0"
        style={{ zIndex: 1 }}
      />

      {/* Playback & Timeline Controls */}
      {
        <div className="right-0 bottom-0 left-0 z-10 border-t border-slate-800/80 bg-slate-950/95 px-4 py-3 backdrop-blur-md">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {/* Slider */}
            <div className="flex flex-1 flex-col gap-2">
              <input
                type="range"
                min="-12"
                max="11"
                value={activeIndex}
                onChange={(e) => {
                  setActiveIndex(Number(e.target.value));
                }}
                className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg transition ${
                  activeIndex > 0 ? 'accent-amber-500' : 'accent-emerald-500'
                }`}
                style={{
                  background:
                    'linear-gradient(to right, #334155 0%, #334155 52.17%, #f59e0baa 52.17%, #f59e0baa 100%)',
                }}
              />
              <div className="flex justify-between px-1 text-[9px] font-medium text-slate-400 select-none">
                <span>-60 min</span>
                <span>Historie</span>
                <span className={activeIndex === 0 ? 'font-bold text-emerald-400' : ''}>Nyní</span>
                <span className={activeIndex > 0 ? 'font-bold text-amber-400' : ''}>Předpověď</span>
                <span>+55 min</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
