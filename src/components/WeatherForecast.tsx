import { Cloud, CloudRain, RefreshCw, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function WeatherForecast() {
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = 'AIzaSyDI6JLAqH6qrMk-PvRKrAC5cLxX3rDpquI';
        const lat = '47.2721226';
        const lon = '12.7599268';
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

    fetchWeather();
  }, []);

  // Weather display list processing for the specific trip week: 4.7. - 10.7.2026
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

    return targetDates.map((target) => {
      // Find matching date in the API response
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
        temp: fallback.temp,
        desc: fallback.desc,
        iconUrl: null,
        icon: fallback.icon,
        color: fallback.color,
        isOnline: false,
      };
    });
  })();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="animate-spin-slow h-5 w-5 text-amber-500" />
          <h3 className="font-display text-lg font-bold text-slate-900">Předpověď počasí Kaprun</h3>
        </div>
        {isWeatherLoading ? (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <RefreshCw className="h-3 w-3 animate-spin" /> Načítám online...
          </span>
        ) : weatherForecast.length > 0 ? null : (
          <span className="text-xs text-slate-400">Typické alpské klima</span>
        )}
      </div>

      {isWeatherLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
          <p className="text-xs text-slate-400">Stahuji aktuální data z Google Weather...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-7">
          {displayWeather.map((w, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-3 text-center transition-all hover:bg-slate-100/50"
            >
              <span className="text-xs font-semibold text-slate-500">{w.day}</span>
              {w.iconUrl ? (
                <img
                  src={w.iconUrl}
                  alt={w.desc}
                  className="my-1 h-8 w-8 object-contain"
                />
              ) : w.icon === 'Sun' ? (
                <Sun className={`my-2 h-6 w-6 ${w.color}`} />
              ) : w.icon === 'Cloud' ? (
                <Cloud className={`my-2 h-6 w-6 ${w.color}`} />
              ) : (
                <CloudRain className={`my-2 h-6 w-6 ${w.color}`} />
              )}
              <span className="text-sm font-bold text-slate-800">{w.temp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
