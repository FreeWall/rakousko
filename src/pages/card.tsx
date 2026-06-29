import { Info } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

import { LinkButton } from '../components/LinkButton';

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
      savingsPerAdult: totalNormalPricePerAdult - cardPricePerAdult,
      isProfitable: totalSavingsGroup > 0,
    };
  };

  const savingsStats = calculateCardSavings();

  return (
    <>
      {/* Main Responsive Area */}
      <main
        className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 overflow-y-auto"
        id="main_content"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden bg-white shadow-sm"
        >
          {/* Hero Banner with SalzburgerLand Card Mobile Image */}
          <div className="relative h-64 w-full overflow-hidden bg-slate-100 sm:h-80 md:h-96">
            <img
              src="/images/mobile_card.webp"
              alt="SalzburgerLand Card"
              className="h-full w-full object-cover object-[center_35%]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 flex flex-row items-end justify-between gap-4 p-6 text-white sm:p-8">
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold md:text-3xl">SalzburgerLand Card</h2>
                <p className="mt-1 max-w-2xl text-xs text-slate-200 md:text-sm">
                  Karta stojí cca <strong>{cardPricePerAdult} €</strong> na 6 dní pro dospělého.
                  Zahrnuje bezplatný vstup na více než 190 atrakcí, koupališť, hradů a lanovek v
                  celém Salcbursku.
                </p>
              </div>
              <div className="shrink-0 self-end">
                <LinkButton
                  variant="external"
                  href="https://www.salzburgerland.com/cs/salzburgerland-card/"
                  type="icon"
                ></LinkButton>
              </div>
            </div>
          </div>

          {/* Details Content Layout */}
          <div className="space-y-6 p-4 sm:p-8">
            {/* Calculator Panel */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Checklist of attractions */}
              <div className="space-y-4 md:col-span-2">
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
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
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
                            <span className="text-sm font-semibold text-slate-800">
                              {attr.name}
                            </span>
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
              <div className="flex h-full flex-col justify-between rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
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
                      <span>S kartou SL (1 os):</span>
                      <span>{cardPricePerAdult.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>S kartou SL (skupina):</span>
                      <span className="font-bold">{savingsStats.cardGroup.toFixed(2)} €</span>
                    </div>
                  </div>

                  {/* Profitability Meter */}
                  <div className="space-y-4 text-center">
                    <div className="space-y-1">
                      <span className="font-mono text-xs tracking-wider text-slate-400 uppercase">
                        Úspora skupiny (4 os):
                      </span>
                      <div
                        className={`font-display text-3xl font-bold ${savingsStats.savingsGroup > 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                      >
                        {savingsStats.savingsGroup > 0 ? '+' : ''}
                        {savingsStats.savingsGroup.toFixed(2)} €
                      </div>
                      <span className="block font-mono text-[10px] text-slate-400">
                        (~ {Math.round(savingsStats.savingsGroup * 25.5)} CZK)
                      </span>
                    </div>

                    <div className="space-y-1 border-t border-white/10 pt-3">
                      <span className="font-mono text-xs tracking-wider text-slate-400 uppercase">
                        Úspora na osobu (1 os):
                      </span>
                      <div
                        className={`font-display text-xl font-bold ${savingsStats.savingsPerAdult > 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                      >
                        {savingsStats.savingsPerAdult > 0 ? '+' : ''}
                        {savingsStats.savingsPerAdult.toFixed(2)} €
                      </div>
                      <span className="block font-mono text-[10px] text-slate-400">
                        (~ {Math.round(savingsStats.savingsPerAdult * 25.5)} CZK)
                      </span>
                    </div>
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
                        Přidejte do seznamu více lanovek (např. Schmittenhöhe nebo Kitzsteinhorn),
                        aby se karta zaplatila.
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
                <span className="font-bold text-slate-800">
                  Užitečné tipy k SalzburgerLand Card:
                </span>
                <ul className="mt-1 list-disc space-y-1 pl-4">
                  <li>
                    Kartu lze zakoupit online v digitální podobě do mobilního telefonu nebo fyzicky
                    na infocentru v Kaprunu.
                  </li>
                  <li>
                    S touto kartou máte navíc 1x za 6 dní možnost bezplatně projet slavnou
                    vysokohorskou silnici <strong>Großglockner Hochalpenstraße</strong>, což je
                    jinak zpoplatněno částkou 43 € za auto!
                  </li>
                  <li>
                    Karta platí i na spoustu dalších atrakcí v okolí, např. hrad Hohenwerfen,
                    soutěsku Liechtensteinklamm či termální lázně Alpentherme v Bad Hofgasteinu.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
