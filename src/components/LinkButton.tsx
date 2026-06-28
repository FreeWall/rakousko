import { ExternalLink } from 'lucide-react';
import React from 'react';

import { GoogleMapsIcon, MapyCzIcon } from './BrandIcons';
import { cn } from '@/lib/utils';

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant: 'mapycz' | 'googlemaps' | 'external';
  href: string;
  children?: React.ReactNode;
  type?: 'default' | 'icon';
}

export function LinkButton({
  variant,
  href,
  children,
  className = '',
  type = 'default',
  ...props
}: LinkButtonProps) {
  const isIcon = type === 'icon';
  const cleanProps = { ...props };

  const baseClass = isIcon
    ? 'inline-flex items-center justify-center rounded-lg p-2.5 shadow-sm transition-colors shrink-0'
    : 'inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-3 text-sm font-semibold shadow-sm transition-colors';

  let variantClass = '';
  let Icon: React.ReactNode = null;

  switch (variant) {
    case 'mapycz':
      variantClass =
        'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900';
      Icon = <MapyCzIcon className={cn('shrink-0', !isIcon ? 'h-4 w-4' : 'h-6 w-6')} />;
      break;
    case 'googlemaps':
      variantClass =
        'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900';
      Icon = <GoogleMapsIcon className={cn('shrink-0', !isIcon ? 'h-4 w-4' : 'h-6 w-6')} />;
      break;
    case 'external':
      variantClass =
        'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900';
      Icon = <ExternalLink className={cn('shrink-0', !isIcon ? 'h-4 w-4' : 'h-6 w-6')} />;
      break;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClass} ${variantClass} ${className}`}
      {...cleanProps}
    >
      {Icon}
      {!isIcon && children}
    </a>
  );
}
