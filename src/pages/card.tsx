import { CreditCard, Info } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

import Header from '@/components/Header';

export default function CardSimulator() {
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([]);

  const cardPricePerAdult = 95.0; // Estimate for a 6-day SalzburgerLand Card in 2026
  const groupSize = 4;

  const attractionsList = [
    {
      id: 'kitzsteinhorn',
      name: 'Ledovec Kitzsteinhorn (Lanovka & Panorama)',
      normalPrice: 54.0,
      category: 'Lanovka',
    },
    {
      id: 'schmittenhohe',
      name: 'Schmittenhöhe kabinková lanovka (Zell am See)',
      normalPrice: 42.0,
      category: 'Lanovka',
    },

    {
      id: 'reservoirs',
      name: 'Kaprunské přehrady (Mooserboden autobus + výtah)',
      normalPrice: 28.5,
      category: 'Příroda',
    },
    { id: 'sigmund', name: 'Soutěska Sigmund-Thun-Klamm', normalPrice: 7.5, category: 'Příroda' },
    {
      id: 'boat',
      name: 'Plavba lodí po jezeře Zell am See',
      normalPrice: 22.0,
      category: 'Zážitek',
    },
    {
      id: 'krimml',
      name: 'Krimmlské vodopády (vstup do soutěsky & park)',
      normalPrice: 12.0,
      category: 'Příroda',
    },
    {
      id: 'tauern',
      name: 'Tauern Spa Kaprun (Sleva/Vstup s kartou)',
      normalPrice: 35.0,
      category: 'Relax',
    },
    { id: 'kitzloch', name: 'Soutěska Kitzlochklamm', normalPrice: 9.0, category: 'Příroda' },
    {
      id: 'wildlife',
      name: 'Wild & Freizeitpark Ferleiten',
      normalPrice: 15.5,
      category: 'Zážitek',
    },
  ];

  const toggleAttraction = (id: string) => {
    if (selectedAttractions.includes(id)) {
      setSelectedAttractions(selectedAttractions.filter((x) => x !== id));
    } else {
      setSelectedAttractions([...selectedAttractions, id]);
    }
  };

  const calculateCardSavings = () => {
    const totalNormalPricePerAdult = attractionsList
      .filter((a) => selectedAttractions.includes(a.id))
      .reduce((acc, curr) => acc + curr.normalPrice, 0);

    const totalNormalPriceGroup = totalNormalPricePerAdult * groupSize;
    const totalCardCostGroup = cardPricePerAdult * groupSize;
    const totalSavingsGroup = totalNormalPriceGroup - totalCardCostGroup;

    return {
      normalPerAdult: totalNormalPricePerAdult,
      normalGroup: totalNormalPriceGroup,
      cardGroup: totalCardCostGroup,
      savingsGroup: totalSavingsGroup,
      isProfitable: totalSavingsGroup > 0,
    };
  };

  const savingsStats = calculateCardSavings();

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
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  <CreditCard className="h-3.5 w-3.5" /> SalzburgerLand Card (SL Card)
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Vyplatí se nám karta?
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Karta stojí cca <strong>{cardPricePerAdult} €</strong> na 6 dní pro dospělého.
                  Zahrnuje bezplatný vstup na více než 190 atrakcí, koupališť, hradů a lanovek v
                  celém Salcbursku. Pojďme si spočítat úsporu pro naši 4člennou skupinu!
                </p>
              </div>
              <div className="shrink-0 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center md:w-48">
                <span className="mb-1 block font-mono text-xs text-slate-400">
                  Cena karty (dospělý)
                </span>
                <span className="text-2xl font-bold text-slate-900">{cardPricePerAdult} €</span>
                <span className="mt-1 block text-[10px] text-slate-400">
                  Skupina (4x): {cardPricePerAdult * 4} €
                </span>
              </div>
            </div>
          </div>

          {/* Calculator Panel */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Checklist of attractions */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
              <h4 className="font-display text-lg font-bold text-slate-900">Plánované atrakce</h4>
              <p className="text-xs text-slate-500">
                Zaškrtněte atrakce, které na dovolené plánujete navštívit, a sledujte úsporu:
              </p>

              <div className="space-y-2.5">
                {attractionsList.map((attr) => {
                  const isSelected = selectedAttractions.includes(attr.id);
                  return (
                    <button
                      key={attr.id}
                      onClick={() => toggleAttraction(attr.id)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                        isSelected
                          ? 'border-slate-300 bg-slate-50/80 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <span className="text-xs font-bold">✓</span>}
                        </div>
                        <div>
                          <span className="mr-2 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-bold text-slate-600 uppercase">
                            {attr.category}
                          </span>
                          <span className="text-sm font-semibold text-slate-800">{attr.name}</span>
                        </div>
                      </div>
                      <span className="ml-4 shrink-0 font-mono text-sm font-bold text-slate-700">
                        {attr.normalPrice.toFixed(2)} €
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Savings Meter Box */}
            <div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
              <div>
                <h4 className="font-display mb-4 text-base font-bold text-white">
                  Finanční přehled (4 dospělí)
                </h4>

                <div className="mb-4 space-y-3.5 border-b border-white/10 pb-4 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bez karty (1 os):</span>
                    <span>{savingsStats.normalPerAdult.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bez karty (skupina):</span>
                    <span>{savingsStats.normalGroup.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2 text-emerald-400">
                    <span>S kartou SL (skupina):</span>
                    <span className="font-bold">{savingsStats.cardGroup.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Profitability Meter */}
                <div className="space-y-1 text-center">
                  <span className="font-mono text-xs tracking-wider text-slate-400 uppercase">
                    Úspora skupiny:
                  </span>
                  <div
                    className={`font-display text-3xl font-bold ${savingsStats.savingsGroup > 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                  >
                    {savingsStats.savingsGroup > 0 ? '+' : ''}
                    {savingsStats.savingsGroup.toFixed(2)} €
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    (~ {Math.round(savingsStats.savingsGroup * 25.5)} CZK)
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                {savingsStats.savingsGroup > 0 ? (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center">
                    <span className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-400">
                      🎉 Karta se jednoznačně VYPLATÍ!
                    </span>
                    <p className="mt-1 text-[10px] text-slate-300">
                      Ušetříte spoustu peněz a ušetříte čas stáním ve frontách na lístky.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-center">
                    <span className="flex items-center justify-center gap-1 text-xs font-bold text-amber-400">
                      ⚠️ Vyplatí se vám lístky kupovat jednotlivě
                    </span>
                    <p className="mt-1 text-[10px] text-slate-300">
                      Přidejte do seznamu více lanovek (např. Schmittenhöhe nebo Kitzsteinhorn), aby
                      se karta zaplatila.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informational Cards about SL Card */}
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-100 p-4 text-xs text-slate-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div>
              <span className="font-bold text-slate-800">Užitečné tipy k SalzburgerLand Card:</span>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                <li>
                  Kartu lze zakoupit online v digitální podobě do mobilního telefonu nebo fyzicky na
                  infocentru v Kaprunu.
                </li>
                <li>
                  S touto kartou máte navíc 1x za 6 dní možnost bezplatně projet slavnou
                  vysokohorskou silnici <strong>Großglockner Hochalpenstraße</strong>, což je jinak
                  zpoplatněno částkou 43 € za auto!
                </li>
                <li>
                  Karta platí i na spoustu dalších atrakcí v okolí, např. hrad Hohenwerfen, soutěsku
                  Liechtensteinklamm či termální lázně Alpentherme v Bad Hofgasteinu.
                </li>
              </ul>
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
    </div>
  );
}
