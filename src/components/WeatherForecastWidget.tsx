import { Cloud, CloudRain, RefreshCw, Sun } from 'lucide-react';
import { AnimatePresence, cubicBezier, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface WeatherForecastWidgetProps {
  children: React.ReactNode;
}

export default function WeatherForecastWidget({ children }: WeatherForecastWidgetProps) {
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isWeatherExpanded, setIsWeatherExpanded] = useState<boolean>(false);

  // Hourly forecast states
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const [isHourlyLoading, setIsHourlyLoading] = useState<boolean>(true);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  useEffect(() => {
    const lat = '47.2721226';
    const lon = '12.7599268';
    const apiKey = 'AIzaSyDI6JLAqH6qrMk-PvRKrAC5cLxX3rDpquI';

    const fetchWeather = async () => {
      try {
        const url = `https://weather.googleapis.com/v1/forecast/days:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}&pageSize=10&units_system=METRIC&language_code=cs`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch weather data: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.forecastDays && data.forecastDays.length > 0) {
          setWeatherForecast(data.forecastDays);
        } else {
          throw new Error('No weather data returned');
        }
      } catch (err: any) {
        console.error('Error loading weather:', err);
        setWeatherError(err.message || 'Nepodařilo se načíst počasí');
      } finally {
        setIsWeatherLoading(false);
      }
    };

    const fetchHourly = async () => {
      try {
        const allHours: any[] = [];
        let pageToken = '';
        const maxPages = 10;

        for (let i = 0; i < maxPages; i++) {
          const url = `https://weather.googleapis.com/v1/forecast/hours:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}&pageSize=24&units_system=METRIC&language_code=cs${pageToken ? `&pageToken=${pageToken}` : ''}`;
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(`Failed to fetch hourly weather: ${res.statusText}`);
          }
          const data = await res.json();
          if (data.forecastHours) {
            allHours.push(...data.forecastHours);
          }
          pageToken = data.nextPageToken;
          if (!pageToken) break;
        }
        setHourlyForecast(allHours);
      } catch (err) {
        console.error('Error loading hourly weather:', err);
      } finally {
        setIsHourlyLoading(false);
      }
    };

    fetchWeather();
    fetchHourly();
  }, []);

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
        if (!dayData?.interval?.startTime) return false;
        const dateObj = new Date(dayData.interval.startTime);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate === target.dateKey;
      });

      if (matchedApiDay) {
        const maxTemp = matchedApiDay.maxTemperature?.degrees;
        const minTemp = matchedApiDay.minTemperature?.degrees;
        const temp =
          maxTemp !== undefined && minTemp !== undefined
            ? `${Math.round(maxTemp)}° / ${Math.round(minTemp)}°C`
            : maxTemp !== undefined
              ? `${Math.round(maxTemp)}°C`
              : 'N/A';

        const desc = matchedApiDay.daytimeForecast?.weatherCondition?.description?.text || 'N/A';
        const iconBaseUri = matchedApiDay.daytimeForecast?.weatherCondition?.iconBaseUri;
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

  // Filter and process hourly forecast for selected day
  const hourlyForSelectedDay = hourlyForecast
    .filter((hourData: any) => {
      if (!hourData?.displayDateTime) return false;
      const year = hourData.displayDateTime.year;
      const month = String(hourData.displayDateTime.month).padStart(2, '0');
      const day = String(hourData.displayDateTime.day).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      return dateKey === currentSelectedKey && hourData.displayDateTime.hours >= 6;
    })
    .map((hourData: any) => {
      const hours = hourData.displayDateTime.hours;
      const timeLabel = `${String(hours).padStart(2, '0')}:00`;

      const temp =
        hourData.temperature?.degrees !== undefined
          ? `${Math.round(hourData.temperature.degrees)}°`
          : 'N/A';

      const desc = hourData.weatherCondition?.description?.text || 'N/A';
      const iconBaseUri = hourData.weatherCondition?.iconBaseUri;
      const iconUrl = iconBaseUri ? `${iconBaseUri}.png` : null;

      const isRain =
        desc.toLowerCase().includes('déšť') ||
        desc.toLowerCase().includes('sráž') ||
        desc.toLowerCase().includes('přeháň') ||
        desc.toLowerCase().includes('bouř');

      const rainProb = hourData.precipitation?.probability?.percent;

      return {
        time: timeLabel,
        temp,
        desc,
        iconUrl,
        icon: isRain ? 'CloudRain' : 'Sun',
        color: isRain ? 'text-sky-500' : 'text-amber-500',
        rainProb: rainProb !== undefined && rainProb > 0 ? `${rainProb}%` : null,
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
      <div className="flex flex-row items-center justify-between gap-4">
        {children}

        {/* Weather Widget Button */}
        <div className="flex shrink-0 items-center">
          {isWeatherLoading ? (
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-500" />
              <span>Počasí...</span>
            </div>
          ) : weatherError ? (
            <div className="text-xs text-red-400">Počasí nedostupné</div>
          ) : activeWeather ? (
            <button
              onClick={() => setIsWeatherExpanded(!isWeatherExpanded)}
              className={cn(
                'group flex cursor-pointer items-center gap-2.5 rounded-xl border border-transparent bg-slate-700/60 px-3.5 py-2 text-sm font-medium transition-all hover:bg-slate-800',
                isWeatherExpanded &&
                  'border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
              )}
              aria-expanded={isWeatherExpanded}
            >
              <div className="text-left">
                <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  {activeDateKey === todayKey ? 'Dnes' : activeWeather.day}
                </div>
                <div className="font-semibold text-white">
                  {activeWeather.maxTemp
                    ? `${activeWeather.maxTemp} / ${activeWeather.minTemp}`
                    : activeWeather.temp}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {activeWeather.iconUrl ? (
                  <img
                    src={activeWeather.iconUrl}
                    alt={activeWeather.desc}
                    className="h-7 w-7 object-contain"
                  />
                ) : activeWeather.icon === 'Sun' ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : activeWeather.icon === 'Cloud' ? (
                  <Cloud className="h-5 w-5 text-slate-400" />
                ) : (
                  <CloudRain className="h-5 w-5 text-sky-400" />
                )}
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
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Týdenní předpověď Kaprun
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
                        <Sun className={`my-2 h-5 w-5 ${w.color}`} />
                      ) : w.icon === 'Cloud' ? (
                        <Cloud className={`my-2 h-5 w-5 ${w.color}`} />
                      ) : (
                        <CloudRain className={`my-2 h-5 w-5 ${w.color}`} />
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
            <div className="">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Hodinová předpověď:{' '}
                  <span className="font-extrabold text-white">{selectedDayLabel}</span>
                </span>
                {isHourlyLoading && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <RefreshCw className="h-3 w-3 animate-spin text-emerald-500" /> Načítám
                    hodiny...
                  </span>
                )}
              </div>

              {isHourlyLoading ? (
                <div className="flex h-20 items-center justify-center gap-2 rounded-xl bg-slate-900/30">
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" />
                  <span className="text-xs text-slate-400">Načítám podrobná data...</span>
                </div>
              ) : hourlyForSelectedDay.length > 0 ? (
                <div className="flex scrollbar-none overflow-x-auto rounded-xl bg-slate-800 pt-0.5 pb-2">
                  {hourlyForSelectedDay.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex min-w-13 flex-col items-center justify-center rounded-xl border-slate-800/50 p-2 pb-0 text-center transition-all"
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
                      {h.rainProb ? (
                        <span className="mt-0.5 flex items-center gap-0.5 text-sm font-semibold text-sky-400">
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
