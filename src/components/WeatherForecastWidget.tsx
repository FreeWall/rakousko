import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Cloud, CloudRain, MapPin, RefreshCw, Sun } from 'lucide-react';
import { AnimatePresence, cubicBezier, motion } from 'motion/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { destinations } from '@/lib/destinations';
import { cn } from '@/lib/utils';

const weatherLocations = [
  {
    name: 'Kaprun',
    lat: '47.2721226',
    lon: '12.7599268',
  },
  {
    name: 'Pension Baranekhof',
    lat: '47.2369',
    lon: '12.723',
  },
  ...destinations
    .filter((d) => d.coords)
    .map((d) => ({
      name: d.name,
      lat: d.coords![0].toString(),
      lon: d.coords![1].toString(),
    })),
];

const API_KEY = 'AIzaSyDI6JLAqH6qrMk-PvRKrAC5cLxX3rDpquI';
const CACHE_TIME = 15 * 60 * 1000;
const GLOBAL_CACHE_KEY = 'weather_app_cache';

interface CacheItem {
  timestamp: number;
  data: any;
}

function readGlobalCache(): Record<string, CacheItem> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(GLOBAL_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error reading global weather cache', e);
    return {};
  }
}

function writeGlobalCache(cache: Record<string, CacheItem>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GLOBAL_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Error writing global weather cache', e);
  }
}

function getCachedData(key: string, cacheTime: number = CACHE_TIME) {
  const cache = readGlobalCache();
  const entry = cache[key];
  if (entry && Date.now() - entry.timestamp < cacheTime) {
    return entry.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  const cache = readGlobalCache();
  const now = Date.now();
  const cleanedCache: Record<string, CacheItem> = {};

  // Clean up entries older than 24 hours to keep the cache size tiny
  for (const [k, entry] of Object.entries(cache)) {
    if (now - entry.timestamp < 24 * 60 * 60 * 1000) {
      cleanedCache[k] = entry;
    }
  }

  cleanedCache[key] = { timestamp: now, data };
  writeGlobalCache(cleanedCache);
}

function minimizeDailyData(data: any) {
  if (!data || !data.forecastDays) return data;
  return {
    forecastDays: data.forecastDays.map((dayData: any) => ({
      time: dayData.interval?.startTime,
      maxTemp: dayData.maxTemperature?.degrees,
      minTemp: dayData.minTemperature?.degrees,
      desc: dayData.daytimeForecast?.weatherCondition?.description?.text,
      icon: dayData.daytimeForecast?.weatherCondition?.iconBaseUri,
    })),
  };
}

function minimizeHourlyData(data: any) {
  if (!data || !data.forecastHours) return data;
  return {
    nextPageToken: data.nextPageToken,
    forecastHours: data.forecastHours.map((hourData: any) => ({
      y: hourData.displayDateTime?.year,
      m: hourData.displayDateTime?.month,
      d: hourData.displayDateTime?.day,
      h: hourData.displayDateTime?.hours,
      temp: hourData.temperature?.degrees,
      desc: hourData.weatherCondition?.description?.text,
      icon: hourData.weatherCondition?.iconBaseUri,
      prec: hourData.precipitation?.probability?.percent,
      wind: hourData.wind?.speed?.value,
    })),
  };
}

function minimizeCurrentData(data: any) {
  if (!data || !data.temperature) return data;
  return {
    temp: data.temperature?.degrees,
    desc: data.weatherCondition?.description?.text,
    icon: data.weatherCondition?.iconBaseUri,
    prec: data.precipitation?.probability?.percent,
  };
}

async function fetchWithCache(url: string, cacheTime: number = CACHE_TIME) {
  if (typeof window === 'undefined') {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    let data = await res.json();
    if (url.includes('days:lookup')) {
      data = minimizeDailyData(data);
    } else if (url.includes('hours:lookup')) {
      data = minimizeHourlyData(data);
    } else if (url.includes('currentConditions:lookup')) {
      data = minimizeCurrentData(data);
    }
    return data;
  }

  const cached = getCachedData(url, cacheTime);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.statusText}`);
  }
  let data = await res.json();

  if (url.includes('days:lookup')) {
    data = minimizeDailyData(data);
  } else if (url.includes('hours:lookup')) {
    data = minimizeHourlyData(data);
  } else if (url.includes('currentConditions:lookup')) {
    data = minimizeCurrentData(data);
  }

  setCachedData(url, data);
  return data;
}

async function fetchWeatherForecast(lat: string, lon: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || API_KEY;
  const url = `https://weather.googleapis.com/v1/forecast/days:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}&pageSize=10&units_system=METRIC&language_code=cs`;
  const data = await fetchWithCache(url, 15 * 60 * 1000); // Denní předpověď 15 minut
  if (data.forecastDays && data.forecastDays.length > 0) {
    return data.forecastDays;
  } else {
    throw new Error('No weather data returned');
  }
}

async function fetchWeatherHourly(lat: string, lon: string, targetDateKey: string) {
  const today = new Date();
  const yearStr = today.getFullYear();
  const monthStr = String(today.getMonth() + 1).padStart(2, '0');
  const dayStr = String(today.getDate()).padStart(2, '0');
  const todayKey = `${yearStr}-${monthStr}-${dayStr}`;

  const isToday = targetDateKey === todayKey;
  const cacheTime = isToday ? 15 * 60 * 1000 : 60 * 60 * 1000; // 15 minut dnes, 1 hodina budoucí dny

  const allHours: any[] = [];
  let pageToken = '';
  const maxPages = 10;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || API_KEY;

  for (let i = 0; i < maxPages; i++) {
    const url = `https://weather.googleapis.com/v1/forecast/hours:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}&pageSize=24&units_system=METRIC&language_code=cs${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const data = await fetchWithCache(url, cacheTime);
    if (!data.forecastHours || data.forecastHours.length === 0) {
      break;
    }

    allHours.push(...data.forecastHours);

    let hasPassedTarget = false;
    for (const hourData of data.forecastHours) {
      if (hourData?.y === undefined) continue;
      const year = hourData.y;
      const month = String(hourData.m).padStart(2, '0');
      const day = String(hourData.d).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      if (dateKey > targetDateKey) {
        hasPassedTarget = true;
        break;
      }
    }

    if (hasPassedTarget) {
      break;
    }

    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  return allHours.filter((hourData: any) => {
    if (hourData?.y === undefined) return false;
    const year = hourData.y;
    const month = String(hourData.m).padStart(2, '0');
    const day = String(hourData.d).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    return dateKey === targetDateKey;
  });
}

async function fetchCurrentWeather(lat: string, lon: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || API_KEY;
  const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}&units_system=METRIC&language_code=cs`;
  const data = await fetchWithCache(url, 10 * 60 * 1000); // 10 minut
  return data;
}

interface WeatherForecastWidgetProps {
  children: React.ReactNode;
}

export default function WeatherForecastWidget({ children }: WeatherForecastWidgetProps) {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(weatherLocations[0]!);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isWeatherExpanded, setIsWeatherExpanded] = useState<boolean>(false);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  useEffect(() => {
    setIsWeatherExpanded(false);
  }, [router.asPath]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedWeatherLocation');
    if (saved) {
      const found = weatherLocations.find((loc) => loc.name === saved);
      if (found) {
        setSelectedLocation(found);
      }
    }
    setIsInitialMount(false);
  }, []);

  // Save to localStorage when selectedLocation changes
  useEffect(() => {
    if (!isInitialMount) {
      localStorage.setItem('selectedWeatherLocation', selectedLocation.name);
    }
  }, [selectedLocation, isInitialMount]);

  const {
    data: weatherForecast = [],
    isLoading: isWeatherQueryLoading,
    error: weatherErrorObj,
  } = useQuery<any[]>({
    queryKey: ['weather', selectedLocation.lat, selectedLocation.lon],
    queryFn: () => fetchWeatherForecast(selectedLocation.lat, selectedLocation.lon),
    enabled: !isInitialMount,
  });

  const {
    data: currentWeather = null,
    isLoading: isCurrentWeatherLoading,
    error: currentWeatherErrorObj,
  } = useQuery<any>({
    queryKey: ['current-weather', selectedLocation.lat, selectedLocation.lon],
    queryFn: () => fetchCurrentWeather(selectedLocation.lat, selectedLocation.lon),
    enabled: !isInitialMount,
  });

  const isWeatherLoading = isInitialMount || isWeatherQueryLoading || isCurrentWeatherLoading;

  const weatherError =
    weatherErrorObj || currentWeatherErrorObj
      ? (weatherErrorObj as Error)?.message ||
        (currentWeatherErrorObj as Error)?.message ||
        'Nepodařilo se načíst počasí'
      : null;

  const today = new Date();
  const yearStr = today.getFullYear();
  const monthStr = String(today.getMonth() + 1).padStart(2, '0');
  const dayStr = String(today.getDate()).padStart(2, '0');
  const todayKey = `${yearStr}-${monthStr}-${dayStr}`;

  const displayWeather = (() => {
    const targetDates = [
      { dateKey: '2026-07-04', dayLabel: 'So 4.7.' },
      { dateKey: '2026-07-05', dayLabel: 'Ne 5.7.' },
      { dateKey: '2026-07-06', dayLabel: 'Po 6.7.' },
      { dateKey: '2026-07-07', dayLabel: 'Út 7.7.' },
      { dateKey: '2026-07-08', dayLabel: 'St 8.7.' },
      { dateKey: '2026-07-09', dayLabel: 'Čt 9.7.' },
      { dateKey: '2026-07-10', dayLabel: 'Pá 10.7.' },
    ];

    const filteredDates = targetDates.filter((t) => t.dateKey >= todayKey);
    const finalTargetDates =
      filteredDates.length > 0 ? filteredDates : [targetDates[targetDates.length - 1]!];

    return finalTargetDates.map((target) => {
      const matchedApiDay = weatherForecast.find((dayData: any) => {
        if (!dayData?.time) return false;
        const dateObj = new Date(dayData.time);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate === target.dateKey;
      });

      if (matchedApiDay) {
        const maxTemp = matchedApiDay.maxTemp;
        const minTemp = matchedApiDay.minTemp;
        const temp =
          maxTemp !== undefined && minTemp !== undefined
            ? `${Math.round(maxTemp)}° / ${Math.round(minTemp)}°C`
            : maxTemp !== undefined
              ? `${Math.round(maxTemp)}°C`
              : 'N/A';

        const desc = matchedApiDay.desc || 'N/A';
        const iconBaseUri = matchedApiDay.icon;
        const iconUrl = iconBaseUri ? `${iconBaseUri}.png` : null;

        const isRain =
          desc.toLowerCase().includes('déšť') ||
          desc.toLowerCase().includes('sráž') ||
          desc.toLowerCase().includes('přeháň') ||
          desc.toLowerCase().includes('bouř');

        return {
          day: target.dayLabel,
          dateKey: target.dateKey,
          maxTemp: maxTemp !== undefined ? `${Math.round(maxTemp)}°` : null,
          minTemp: minTemp !== undefined ? `${Math.round(minTemp)}°` : null,
          temp,
          desc,
          iconUrl,
          icon: isRain ? 'CloudRain' : 'Sun',
          color: isRain ? 'text-sky-500' : 'text-amber-500',
          isOnline: true,
        };
      }

      const fallback = {
        temp: 'N/A',
        desc: 'N/A',
        icon: 'Cloud',
        color: 'text-slate-400',
      };

      return {
        day: target.dayLabel,
        dateKey: target.dateKey,
        maxTemp: null,
        minTemp: null,
        temp: fallback.temp,
        desc: fallback.desc,
        iconUrl: null,
        icon: fallback.icon,
        color: fallback.color,
        isOnline: false,
      };
    });
  })();

  let activeDateKey = todayKey;
  if (todayKey < '2026-07-04') {
    activeDateKey = '2026-07-04';
  } else if (todayKey > '2026-07-10') {
    activeDateKey = '2026-07-10';
  }

  const activeWeather =
    displayWeather.find((w) => w.dateKey === activeDateKey) || displayWeather[0];

  // Resolve currently active key for hourly display
  const currentSelectedKey = selectedDateKey || activeDateKey;

  const { data: hourlyForecast = [], isLoading: isHourlyQueryLoading } = useQuery<any[]>({
    queryKey: ['weather-hourly', selectedLocation.lat, selectedLocation.lon, currentSelectedKey],
    queryFn: () =>
      fetchWeatherHourly(selectedLocation.lat, selectedLocation.lon, currentSelectedKey),
    enabled: !isInitialMount,
  });

  const isHourlyLoading = isInitialMount || isHourlyQueryLoading;

  // Filter and process hourly forecast for selected day
  const hourlyForSelectedDay = hourlyForecast
    .filter((hourData: any) => {
      if (hourData?.y === undefined) return false;
      const year = hourData.y;
      const month = String(hourData.m).padStart(2, '0');
      const day = String(hourData.d).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      return dateKey === currentSelectedKey && hourData.h >= 6;
    })
    .map((hourData: any) => {
      const hours = hourData.h;
      const timeLabel = `${String(hours).padStart(2, '0')}:00`;

      const temp = hourData.temp !== undefined ? `${Math.round(hourData.temp)}°` : 'N/A';

      const desc = hourData.desc || 'N/A';
      const iconBaseUri = hourData.icon;
      const iconUrl = iconBaseUri ? `${iconBaseUri}.png` : null;

      const isRain =
        desc.toLowerCase().includes('déšť') ||
        desc.toLowerCase().includes('sráž') ||
        desc.toLowerCase().includes('přeháň') ||
        desc.toLowerCase().includes('bouř');

      const rainProb = hourData.prec;
      const windSpeed = hourData.wind;

      return {
        time: timeLabel,
        temp,
        desc,
        iconUrl,
        icon: isRain ? 'CloudRain' : 'Sun',
        color: isRain ? 'text-sky-500' : 'text-amber-500',
        rainProb: rainProb !== undefined && rainProb > 0 ? `${rainProb}%` : null,
        windSpeed: windSpeed !== undefined ? `${Math.round(windSpeed)} km/h` : null,
      };
    });

  const selectedDayObj = displayWeather.find((w) => w.dateKey === currentSelectedKey);
  const selectedDayLabel = selectedDayObj
    ? currentSelectedKey === todayKey
      ? `Dnes (${selectedDayObj.day})`
      : selectedDayObj.day
    : '';

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        {children}

        {/* Weather Widget Button */}
        <div className="flex shrink-0 items-center">
          {isWeatherLoading ? (
            <button
              onClick={() => setIsWeatherExpanded(!isWeatherExpanded)}
              className={cn(
                'flex cursor-pointer flex-col gap-1 rounded-xl border border-transparent bg-slate-700/60 px-3 py-2 text-sm font-medium transition-all hover:bg-slate-800',
                isWeatherExpanded &&
                  'border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
              )}
              aria-expanded={isWeatherExpanded}
            >
              <div className="max-w-30 truncate text-left text-[9px] font-bold tracking-wider text-emerald-400 uppercase">
                Počasí
              </div>
              <div className="flex items-center justify-between gap-2.5">
                <div className="text-left">
                  <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    Dnes
                  </div>
                  <div className="font-semibold text-white">N/A</div>
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw className="h-5 w-5 animate-spin text-emerald-500" />
                </div>
              </div>
            </button>
          ) : weatherError ? (
            <div className="text-xs text-red-400">Počasí nedostupné</div>
          ) : activeWeather ? (
            <button
              onClick={() => setIsWeatherExpanded(!isWeatherExpanded)}
              className={cn(
                'flex cursor-pointer flex-col gap-1 rounded-xl border border-transparent bg-slate-700/60 px-3 py-2 text-sm font-medium transition-all hover:bg-slate-800',
                isWeatherExpanded &&
                  'border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
              )}
              aria-expanded={isWeatherExpanded}
            >
              <div className="max-w-30 truncate text-left text-[9px] font-bold tracking-wider text-emerald-400 uppercase">
                {selectedLocation.name}
              </div>
              <div className="flex items-center justify-between gap-2.5">
                <div className="text-left">
                  <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    Aktuálně
                  </div>
                  <div className="flex items-baseline font-semibold text-white">
                    {currentWeather ? (
                      <>
                        <span>{Math.round(currentWeather.temp)}°C</span>
                        {currentWeather.prec !== undefined && currentWeather.prec > 0 && (
                          <span className="ml-1.5 text-sm font-semibold text-sky-400">
                            {currentWeather.prec}%
                          </span>
                        )}
                      </>
                    ) : activeWeather.maxTemp ? (
                      `${activeWeather.maxTemp} / ${activeWeather.minTemp}`
                    ) : (
                      activeWeather.temp
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {currentWeather ? (
                    currentWeather.icon ? (
                      <img
                        src={`${currentWeather.icon}.png`}
                        alt={currentWeather.desc}
                        className="h-7 w-7 object-contain"
                      />
                    ) : currentWeather.desc?.toLowerCase().includes('déšť') ||
                      currentWeather.desc?.toLowerCase().includes('sráž') ||
                      currentWeather.desc?.toLowerCase().includes('přeháň') ||
                      currentWeather.desc?.toLowerCase().includes('bouř') ? (
                      <CloudRain className="h-7 w-7 text-sky-400" />
                    ) : (
                      <Sun className="h-7 w-7 text-amber-500" />
                    )
                  ) : activeWeather.iconUrl ? (
                    <img
                      src={activeWeather.iconUrl}
                      alt={activeWeather.desc}
                      className="h-7 w-7 object-contain"
                    />
                  ) : activeWeather.icon === 'Sun' ? (
                    <Sun className="h-7 w-7 text-amber-500" />
                  ) : activeWeather.icon === 'Cloud' ? (
                    <Cloud className="h-7 w-7 text-slate-400" />
                  ) : (
                    <CloudRain className="h-7 w-7 text-sky-400" />
                  )}
                </div>
              </div>
            </button>
          ) : null}
        </div>
      </div>

      {/* Expanded weekly forecast */}
      <AnimatePresence>
        {isWeatherExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            exit={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3, ease: cubicBezier(0.16, 1, 0.3, 1) }}
            className="w-full space-y-4 overflow-hidden"
          >
            {/* Weekly section */}

            <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Lokace
              </span>
              {/* Location Selector */}
              <div className="relative flex w-full items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-3 text-white">
                <div className="flex w-full items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-sm font-semibold text-white">{selectedLocation.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  value={selectedLocation.name}
                  onChange={(e) => {
                    const target = weatherLocations.find((loc) => loc.name === e.target.value);
                    if (target) {
                      setSelectedLocation(target);
                    }
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
                >
                  {weatherLocations.map((loc) => (
                    <option
                      key={loc.name}
                      value={loc.name}
                      className="bg-slate-900 text-white"
                    >
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Weekly section */}
            <div className="mt-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Týdenní předpověď
                </span>
              </div>
              <div className="flex scrollbar-none gap-2.5 overflow-x-auto pt-0.5 pb-2">
                {displayWeather.map((w, idx) => {
                  const isCurrent = w.dateKey === currentSelectedKey;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDateKey(w.dateKey)}
                      className={`flex w-25 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border py-2.5 text-center transition-all ${
                        isCurrent
                          ? 'border-emerald-500 bg-slate-800 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold ${isCurrent ? 'text-emerald-400' : 'text-slate-400'}`}
                      >
                        {w.day}
                      </span>
                      {w.iconUrl ? (
                        <img
                          src={w.iconUrl}
                          alt={w.desc}
                          className="my-1.5 h-8 w-8 object-contain"
                        />
                      ) : w.icon === 'Sun' ? (
                        <Sun className={`my-1.5 h-8 w-8 ${w.color}`} />
                      ) : w.icon === 'Cloud' ? (
                        <Cloud className={`my-1.5 h-8 w-8 ${w.color}`} />
                      ) : (
                        <CloudRain className={`my-1.5 h-8 w-8 ${w.color}`} />
                      )}
                      <div className="text-sm font-semibold">
                        {w.maxTemp ? (
                          <>
                            <span className="text-white">{w.maxTemp}</span>
                            {w.minTemp && (
                              <span className="font-medium text-slate-500"> / {w.minTemp}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400">{w.temp}</span>
                        )}
                      </div>
                      <div className="mt-1 max-w-full truncate text-xs text-slate-400">
                        {w.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hourly section */}
            <div className="pb-2">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Hodinová předpověď:{' '}
                  <span className="font-extrabold text-white">{selectedDayLabel}</span>
                </span>
              </div>

              {isHourlyLoading ? (
                <div className="flex h-33.5 items-center justify-center gap-2 rounded-xl bg-slate-900/30">
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" />
                  <span className="text-xs text-slate-400">Načítám podrobná data...</span>
                </div>
              ) : hourlyForSelectedDay.length > 0 ? (
                <div className="flex scrollbar-none overflow-x-auto rounded-xl bg-slate-800 px-1">
                  {hourlyForSelectedDay.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex min-w-13 flex-col items-center justify-center rounded-xl border-slate-800/50 p-3 text-center transition-all"
                    >
                      <span className="text-xs font-semibold text-slate-400">{h.time}</span>
                      {h.iconUrl ? (
                        <img
                          src={h.iconUrl}
                          alt={h.desc}
                          className="my-1 h-6 w-6 object-contain"
                        />
                      ) : h.icon === 'Sun' ? (
                        <Sun className={`my-1 h-4 w-4 ${h.color}`} />
                      ) : h.icon === 'Cloud' ? (
                        <Cloud className={`my-1 h-4 w-4 ${h.color}`} />
                      ) : (
                        <CloudRain className={`my-1 h-4 w-4 ${h.color}`} />
                      )}
                      <span className="text-sm font-semibold text-white">{h.temp}</span>

                      {h.windSpeed && (
                        <span className="mt-1 text-xs font-semibold whitespace-nowrap text-slate-400">
                          {h.windSpeed}
                        </span>
                      )}
                      {h.rainProb ? (
                        <span className="mt-0.5 text-sm font-semibold text-sky-400">
                          {h.rainProb}
                        </span>
                      ) : (
                        <span className="mt-0.5 text-sm text-transparent select-none">-</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20 p-4 text-center">
                  <span className="text-xs text-slate-500">
                    Hodinová předpověď pro tento den již/ještě není k dispozici (limit API je 10
                    dní).
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
