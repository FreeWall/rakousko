import { Home, MapPin, Mountain, QrCode, Route } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import WeatherForecastWidget from './WeatherForecastWidget';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

export default function Header({ title = 'Rakousko 2026', subtitle }: HeaderProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    if (path === '/' && currentPath.startsWith('/destination')) return true;

    return false;
  };

  const navItems = [
    { href: '/', label: 'Lokace', Icon: MapPin },
    { href: '/hikes', label: 'Trasy', Icon: Route },
    { href: '/accommodation', label: 'Ubytování', Icon: Home },
    { href: '/card', label: 'Karta', Icon: QrCode },
    /* {
      href: '/map',
      label: 'Mapa',
      Icon: Map,
    }, */
  ];

  return (
    <>
      {/* Top Brand Banner & Info */}
      <header
        className="relative shrink-0 overflow-hidden bg-slate-900 px-4 py-5 text-white"
        id="header"
      >
        <div className="relative z-10 mx-auto max-w-4xl">
          <WeatherForecastWidget>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Link href="/">
                  <h1
                    className="font-display text-xl font-bold text-white md:text-3xl"
                    id="main_title"
                  >
                    {title}
                  </h1>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  <Mountain className="h-3.5 w-3.5" /> Zell am See &bull; Kaprun
                </span>
                {subtitle && (
                  <p className="flex items-center gap-1.5 text-sm text-slate-400">
                    <MapPin className="h-4 w-4 shrink-0 text-emerald-500" /> {subtitle}
                  </p>
                )}
              </div>
            </div>
          </WeatherForecastWidget>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <nav
        className="sticky top-0 z-40 flex shrink-0 scrollbar-none justify-center bg-transparent px-3 py-3"
        id="navigation_bar"
      >
        <div className="flex w-full max-w-4xl scrollbar-none gap-1 rounded-xl bg-slate-900 p-1.5">
          {navItems.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`group flex min-w-0 flex-auto items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-bold transition-all duration-200 md:gap-1.5 md:px-4 ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
