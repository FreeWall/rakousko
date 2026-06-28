import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Info,
  MapPin,
  Mountain,
  Navigation,
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

import { destinations } from '@/lib/destinations';

export default function Home() {
  const [expandedDay, setExpandedDay] = useState<string | null>('kitzsteinhorn');

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
          {/* Destinations List Section */}
          <div className="space-y-4">
            <div className="space-y-3">
              {destinations.map((dest) => {
                const isExpanded = expandedDay === dest.id;

                return (
                  <div
                    key={dest.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300"
                  >
                    {/* Destination Header Trigger */}
                    <button
                      onClick={() => setExpandedDay(isExpanded ? null : dest.id)}
                      className="group flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/60 bg-slate-100 shadow-sm">
                          {dest.imageUrl ? (
                            <img
                              src={dest.imageUrl}
                              alt={dest.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <MapPin className="h-5 w-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm leading-snug font-semibold text-slate-900">
                            {dest.name}
                          </h4>
                        </div>
                      </div>
                      <div className="ml-4 shrink-0 text-slate-400">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </button>

                    {/* Destination Content */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/30 px-5 pb-5">
                        <div className="grid grid-cols-1 gap-5 pt-4 md:grid-cols-2">
                          {/* Left Side: Description, Highlights & Big Photo */}
                          <div className="flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm leading-relaxed text-slate-600">
                                  {dest.description}
                                </p>
                              </div>

                              <div>
                                <span className="mb-2 block font-mono text-[11px] tracking-wider text-slate-400 uppercase">
                                  Hlavní lákadla
                                </span>
                                <ul className="space-y-2">
                                  {dest.highlights.map((highlight, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2 text-sm text-slate-700"
                                    >
                                      <span className="mt-0.5 shrink-0 font-bold text-emerald-500">
                                        •
                                      </span>
                                      <span>{highlight}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {dest.imageUrl && (
                              <div className="relative mt-3 h-44 w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-xs">
                                <img
                                  src={dest.imageUrl}
                                  alt={dest.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          {/* Right Side: Tips, SalzburgerLand Card & Notes */}
                          <div className="flex flex-col justify-between gap-4">
                            <div className="space-y-3">
                              {/* Tips */}
                              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-800">
                                <div className="mb-1 flex items-center gap-1.5 font-bold">
                                  <Info className="h-3.5 w-3.5 shrink-0 text-emerald-600" />{' '}
                                  Doporučení & Tipy
                                </div>
                                <p className="leading-relaxed">{dest.tips}</p>
                              </div>

                              {/* SalzburgerLand Card Info */}
                              {dest.slCardInfo && (
                                <div className="flex items-center justify-between gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-blue-800">
                                  <div className="flex items-center gap-1.5">
                                    <CreditCard className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                                    <span>
                                      <strong>SalzburgerLand Card:</strong> {dest.slCardInfo}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Cable car operating details and dog price */}
                              {(dest.cableCarHours || dest.cableCarDuration || dest.dogPrice) && (
                                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-100/70 p-3 text-xs text-slate-700">
                                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                    <Mountain className="h-3.5 w-3.5 shrink-0 text-emerald-600" />{' '}
                                    Detaily dopravy / lanovky
                                  </div>
                                  <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-3">
                                    {dest.cableCarHours && (
                                      <div>
                                        <span className="block font-mono text-[10px] leading-tight text-slate-400 uppercase">
                                          Provoz
                                        </span>
                                        <span className="font-medium text-slate-900">
                                          {dest.cableCarHours}
                                        </span>
                                      </div>
                                    )}
                                    {dest.cableCarDuration && (
                                      <div>
                                        <span className="block font-mono text-[10px] leading-tight text-slate-400 uppercase">
                                          Doba jízdy
                                        </span>
                                        <span className="font-medium text-slate-900">
                                          {dest.cableCarDuration}
                                        </span>
                                      </div>
                                    )}
                                    {dest.dogPrice && (
                                      <div>
                                        <span className="block font-mono text-[10px] leading-tight text-slate-400 uppercase">
                                          Pes
                                        </span>
                                        <span className="font-medium text-slate-900">
                                          {dest.dogPrice}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Custom Note Box & Links */}
                            <div className="space-y-3 pt-2">
                              {/* Links */}
                              {(dest.mapyUrl || dest.webUrl) && (
                                <div className="flex gap-2">
                                  {dest.mapyUrl && (
                                    <a
                                      href={dest.mapyUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
                                    >
                                      <Navigation className="h-3.5 w-3.5" /> Trasa na Mapy.cz
                                    </a>
                                  )}
                                  {dest.webUrl && (
                                    <a
                                      href={dest.webUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-200"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5 text-slate-500" />{' '}
                                      Oficiální web
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Humble craft footer */}
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
