import { ExternalLink } from 'lucide-react';
import React from 'react';

import { GoogleMapsIcon, MapyCzIcon } from './BrandIcons';

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant: 'mapycz' | 'googlemaps' | 'external';
  href: string;
  children: React.ReactNode;
}

export function LinkButton({ variant, href, children, className = '', ...props }: LinkButtonProps) {
  const baseClass =
    'inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-sm transition-colors';

  let variantClass = '';
  let Icon: React.ReactNode = null;

  switch (variant) {
    case 'mapycz':
      variantClass = 'border border-transparent bg-emerald-600 text-white hover:bg-emerald-700';
      Icon = <MapyCzIcon className="h-4 w-4 shrink-0" />;
      break;
    case 'googlemaps':
      variantClass =
        'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900';
      Icon = <GoogleMapsIcon className="h-4 w-4 shrink-0" />;
      break;
    case 'external':
      variantClass =
        'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900';
      Icon = <ExternalLink className="h-4 w-4 shrink-0" />;
      break;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClass} ${variantClass} ${className}`}
      {...props}
    >
      {Icon}
      {children}
    </a>
  );
}
