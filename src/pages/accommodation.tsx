import {
  Car,
  Coffee,
  Compass,
  ExternalLink,
  KeyRound,
  MapPin,
  Navigation,
  ShieldCheck,
  Trees,
  Wifi,
} from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import Header from '@/components/Header';

export default function Accommodation() {
  const address = 'Spatlahnerweg 13, 5710 Kaprun, Rakousko';

  const advantages = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
      title: 'Český personál',
      description:
        'Penzion provozují Češi, domluvíte se snadno a získáte nejlepší lokální tipy v mateřštině.',
    },
    {
      icon: <Coffee className="h-5 w-5 text-emerald-600" />,
      title: 'Vydatné snídaně',
      description:
        'Bohaté buffetové snídaně s čerstvým pečivem, které vám dodají energii na celodenní túry.',
    },
    {
      icon: <Car className="h-5 w-5 text-emerald-600" />,
      title: 'Parkování zdarma',
      description: 'Přímo u budovy penzionu je dostatek parkovacích míst zdarma pro všechny hosty.',
    },
    {
      icon: <Wifi className="h-5 w-5 text-emerald-600" />,
      title: 'Rychlá Wi-Fi',
      description: 'Bezplatné bezdrátové připojení k internetu je dostupné v celém objektu.',
    },
    {
      icon: <KeyRound className="h-5 w-5 text-emerald-600" />,
      title: 'Zázemí pro turisty',
      description:
        'K dispozici je kolárna / lyžárna a sušárna bot pro pohodlné uložení vašeho vybavení.',
    },
    {
      icon: <Trees className="h-5 w-5 text-emerald-600" />,
      title: 'Společenská místnost',
      description:
        'Sdílená, skvěle vybavená kuchyňka a společný prostor pro večerní plánování tras.',
    },
  ];

  const distances = [
    { target: 'Centrum Kaprunu (obchody, restaurace)', dist: '1.2 km' },
    { target: 'Lanovka MK Maiskogelbahn (směr ledovec)', dist: '1.5 km' },
    { target: 'Soutěska Sigmund-Thun-Klamm', dist: '1.8 km' },
    { target: 'Lázně a bazény Tauern Spa Kaprun', dist: '2.5 km' },
    { target: 'Jezero a město Zell am See', dist: '7.5 km' },
  ];

  return (
    <div
      className="flex min-h-screen flex-col bg-slate-50 text-slate-800 selection:bg-emerald-200 selection:text-emerald-900"
      id="main_container"
    >
      <Header />

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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute right-5 bottom-5 left-5 text-white">
                <h2 className="font-display text-2xl font-bold md:text-3xl">Pension Baranekhof</h2>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-200 md:text-sm">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" /> {address}
                </p>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <p className="text-sm leading-relaxed text-slate-600">
                Baranekhof je útulný alpský penzion rodinného typu nacházející se v klidné části
                Kaprunu, obklopený dechberoucím panoramatem Vysokých Taur. Vyznačuje se přátelskou
                atmosférou, pohodlným zázemím a především <strong>českým provozem</strong>, díky
                čemuž je ideálním výchozím bodem pro české turisty a sportovce.
              </p>
            </div>
          </div>

          {/* Two column grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left/Middle Column: Advantages and Info */}
            <div className="space-y-6 md:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-display mb-4 text-lg font-bold text-slate-900">
                  Proč se ubytovat právě u nás?
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {advantages.map((adv, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3"
                    >
                      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
                        {adv.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{adv.title}</h4>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                          {adv.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distances and Location detail */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-display mb-3.5 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Compass className="h-5 w-5 text-emerald-600" /> Vzdálenosti & Dostupnost
                </h3>
                <div className="divide-y divide-slate-100">
                  {distances.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between py-2.5 text-sm"
                    >
                      <span className="text-slate-600">{item.target}</span>
                      <span className="font-mono font-bold text-slate-900">{item.dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Check-in, contacts and links */}
            <div className="space-y-6">
              {/* Check-in Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="font-display mb-3 text-base font-bold text-slate-900">
                  Příjezd & Odjezd
                </h4>
                <div className="space-y-3.5 text-xs">
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <span className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                      Check-in (Příjezd)
                    </span>
                    <span className="text-sm font-bold text-slate-800">Od 15:00 hod</span>
                    <p className="mt-1 text-slate-500">
                      Pokud dorazíte později, dejte prosím vědět předem na recepci penzionu.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <span className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                      Check-out (Odjezd)
                    </span>
                    <span className="text-sm font-bold text-slate-800">Do 10:00 hod</span>
                    <p className="mt-1 text-slate-500">
                      V den odjezdu je nutné vyklidit pokoj pro přípravu novým hostům.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Links & Location Map */}
              <div className="flex flex-col gap-2.5 rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
                <h4 className="font-display mb-1 text-base font-bold text-white">Rychlé Odkazy</h4>
                <p className="mb-3 text-[11px] text-slate-400">
                  Naplánujte si cestu nebo si prohlédněte oficiální stránky s fotogalerií a
                  kontakty.
                </p>

                <a
                  href="https://mapy.com/cs/turisticka?source=osm&id=1072899509"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                  <Navigation className="h-4 w-4" /> Baranekhof na Mapy.cz
                </a>

                <a
                  href="https://baranekresorts.com/cs/dum/baranekhof"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" /> Oficiální Web (Česky)
                </a>
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
    </div>
  );
}
