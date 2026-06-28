import { Calendar, Compass, CreditCard, Home, Map, MapPin, Mountain } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

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
    return false;
  };

  const navItems = [
    { href: '/', label: 'Program & Info', Icon: Calendar },
    { href: '/accommodation', label: 'Ubytování', Icon: Home },
    { href: '/hikes', label: 'Trasy Mapy.cz', Icon: Compass },
    { href: '/card', label: 'Salzburger Card', Icon: CreditCard },
    {
      href: '/map',
      label: 'Mapa destinací',
      Icon: Map,
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <>
      {/* Top Brand Banner & Info */}
      <header
        className="relative shrink-0 overflow-hidden border-b border-slate-800 bg-slate-900 px-4 py-6 text-white md:px-8"
        id="header"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-900 to-slate-900" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h1
                className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl"
                id="main_title"
              >
                {title}
              </h1>
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
        </div>
      </header>

      {/* Main Tab Navigation */}
      <nav
        className="sticky top-0 z-40 flex shrink-0 scrollbar-none justify-start overflow-x-auto border-b border-slate-200 bg-white px-2 py-2.5 md:justify-center md:px-8"
        id="navigation_bar"
      >
        <div className="flex w-full max-w-4xl gap-1.5">
          {navItems.map(({ href, label, Icon, iconColor }) => (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                isActive(href)
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${iconColor || ''}`} /> {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
