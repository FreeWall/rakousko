import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { LinkButton } from '../components/LinkButton';

export default function Accommodation() {
  const address = 'Kesselfallstraße 63, 5710 Kaprun';

  const infoItems = [
    { label: 'Check-in (Příjezd)', value: 'Od 15:00' },
    { label: 'Check-out (Odjezd)', value: 'Do 10:00' },
    { label: 'Telefon', value: '+420 777 201 423', href: 'tel:+420777201423' },
    { label: 'E-mail', value: 'info@baranekresorts.com', href: 'mailto:info@baranekresorts.com' },
  ];

  return (
    <>
      {/* Main Responsive Area */}
      <main
        className="overflow-y-none mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6"
        id="main_content"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden bg-white pb-10 shadow-sm"
        >
          {/* Hero section with visual of the pension */}
          <div className="relative h-64 w-full overflow-hidden bg-slate-100 sm:h-80 md:h-96">
            <img
              src="/images/pension_baranekhof.webp"
              alt="Pension Baranekhof v Kaprunu"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-6 text-white sm:p-8">
              <h2 className="font-display text-2xl font-bold md:text-3xl">Pension Baranekhof</h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-200 md:text-sm">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" /> {address}
              </p>
            </div>
          </div>

          {/* Details Content Layout */}
          <div className="p-4 sm:p-8">
            <div className="divide-y divide-slate-100">
              {infoItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-3 text-sm first:pt-0"
                >
                  <span className="font-medium text-slate-600">{item.label}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-bold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="font-bold text-slate-900">{item.value}</span>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between gap-3 pt-3 text-sm">
                <div>
                  <LinkButton
                    variant="external"
                    href="https://baranekresorts.com/cs/dum/baranekhof"
                  >
                    Oficiální web
                  </LinkButton>
                </div>
                <div className="flex gap-3">
                  <LinkButton
                    variant="googlemaps"
                    href="https://www.google.com/maps?cid=13611371175237802278"
                    type="icon"
                  ></LinkButton>
                  <LinkButton
                    variant="mapycz"
                    href="https://mapy.com/cs/turisticka?source=osm&id=1072899509"
                    type="icon"
                  ></LinkButton>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
