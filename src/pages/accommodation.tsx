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
        className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 md:py-8"
        id="main_content"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* Hero section with visual of the pension */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-64 w-full bg-slate-100 sm:h-80 md:h-96">
              <img
                src="/images/pension_baranekhof.webp"
                alt="Pension Baranekhof v Kaprunu"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute right-5 bottom-5 left-5 text-white">
                <h2 className="font-display text-2xl font-bold md:text-3xl">Pension Baranekhof</h2>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-200 md:text-sm">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" /> {address}
                </p>
              </div>
            </div>
          </div>

          {/* Two column grid */}
          <div className="gap-6 md:grid-cols-3">
            {/* Left/Middle Column: Vital details */}
            <div className="space-y-6 md:col-span-2">
              {/* Unified Info Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
                  <div className="flex justify-end gap-3 pt-3 text-sm">
                    <LinkButton
                      variant="external"
                      href="https://baranekresorts.com/cs/dum/baranekhof"
                    >
                      Oficiální web
                    </LinkButton>
                    <LinkButton
                      variant="googlemaps"
                      href="https://www.google.com/maps/search/?api=1&query=Pension+Baranekhof+Kaprun+Austria"
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
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className="shrink-0 border-t border-slate-200 bg-slate-100 px-4 py-4 text-center text-xs text-slate-500"
        id="footer"
      >
        Aktivní Dovolená Kaprun &bull; 4.7.2026 - 10.7.2026 &bull; Pension Baranekhof &bull;
        Vyrobeno s láskou k horám 🏔️
      </footer>
    </>
  );
}
