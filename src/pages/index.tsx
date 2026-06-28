import {
  AlertTriangle,
  Award,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Cloud,
  CloudRain,
  Compass,
  CreditCard,
  ExternalLink,
  Flame,
  Info,
  Map,
  MapPin,
  Mountain,
  Navigation,
  RefreshCw,
  Sun,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

// Types
interface Participant {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // ID of participant
  sharedWith: string[]; // Array of IDs
}

import { destinations } from '@/lib/destinations';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'hikes' | 'card'>('overview');

  // Time States
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVacationOver, setIsVacationOver] = useState(false);
  const [isVacationActive, setIsVacationActive] = useState(false);

  // Group / Splitter States
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Tomáš' },
    { id: '2', name: 'Lucie' },
    { id: '3', name: 'Honza' },
    { id: '4', name: 'Klára' },
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpensePayer, setNewExpensePayer] = useState('1');
  const [newExpenseShared, setNewExpenseShared] = useState<string[]>(['1', '2', '3', '4']);

  // Itinerary Notes
  const [itineraryNotes, setItineraryNotes] = useState<Record<string, string>>({});

  // SalzburgerLand Card Interactive Simulator
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([
    'kitzsteinhorn',
    'schmittenhohe',
    'reservoirs',
    'sigmund',
    'boat',
  ]);

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

  // Expanded Destination state in Overview
  const [expandedDay, setExpandedDay] = useState<string | null>('kitzsteinhorn');

  // Weather Online States
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = 'AIzaSyDI6JLAqH6qrMk-PvRKrAC5cLxX3rDpquI';
        const lat = '47.2721226';
        const lon = '12.7599268';
        const url = `https://weather.googleapis.com/v1/forecast/days:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}&pageSize=10&units_system=METRIC&language_code=cs`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch weather data: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.forecastDays && data.forecastDays.length > 0) {
          setWeatherForecast(data.forecastDays);
        } else {
          throw new Error('No weather data returned');
        }
      } catch (err: any) {
        console.error('Error loading weather:', err);
        setWeatherError(err.message || 'Nepodařilo se načíst počasí');
      } finally {
        setIsWeatherLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // Load from LocalStorage
  useEffect(() => {
    // Set states asynchronously to prevent synchronous setState in effect warnings
    const mountHandle = requestAnimationFrame(() => {
      setMounted(true);

      try {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab && ['overview', 'hikes', 'card'].includes(tab)) {
          setActiveTab(tab as any);
        }

        const savedParticipants = localStorage.getItem('kaprun_participants');
        if (savedParticipants) setParticipants(JSON.parse(savedParticipants));

        const savedExpenses = localStorage.getItem('kaprun_expenses');
        if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

        const savedNotes = localStorage.getItem('kaprun_notes');
        if (savedNotes) setItineraryNotes(JSON.parse(savedNotes));
      } catch (err) {
        console.error('Error loading localStorage data:', err);
      }
    });

    // Countdown calc
    const targetDate = new Date('2026-07-04T08:00:00').getTime();
    const endDate = new Date('2026-07-10T18:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diffStart = targetDate - now;
      const diffEnd = endDate - now;

      if (diffEnd < 0) {
        setIsVacationOver(true);
        setIsVacationActive(false);
      } else if (diffStart < 0) {
        setIsVacationActive(true);
        setIsVacationOver(false);
      } else {
        setIsVacationActive(false);
        setIsVacationOver(false);

        const d = Math.floor(diffStart / (1000 * 60 * 60 * 24));
        const h = Math.floor((diffStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diffStart % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diffStart % (1000 * 60)) / 1000);

        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(mountHandle);
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('kaprun_participants', JSON.stringify(participants));
  }, [participants, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('kaprun_expenses', JSON.stringify(expenses));
  }, [expenses, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('kaprun_notes', JSON.stringify(itineraryNotes));
  }, [itineraryNotes, mounted]);



  // Calculations for Splitter
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseDesc.trim() || !newExpenseAmount) return;

    const parsedAmount = parseFloat(newExpenseAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: newExpenseDesc.trim(),
      amount: parsedAmount,
      paidBy: newExpensePayer,
      sharedWith: newExpenseShared.length > 0 ? newExpenseShared : participants.map((p) => p.id),
    };

    setExpenses([...expenses, newExpense]);
    setNewExpenseDesc('');
    setNewExpenseAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleToggleSharedWith = (pId: string) => {
    if (newExpenseShared.includes(pId)) {
      setNewExpenseShared(newExpenseShared.filter((id) => id !== pId));
    } else {
      setNewExpenseShared([...newExpenseShared, pId]);
    }
  };

  const calculateBalances = () => {
    const balances: Record<string, number> = {};
    // Initialize
    participants.forEach((p) => {
      balances[p.id] = 0;
    });

    // Run calculations
    expenses.forEach((exp) => {
      const payerId = exp.paidBy;
      const amount = exp.amount;
      const shareCount = exp.sharedWith.length;
      if (shareCount === 0) return;

      const individualShare = amount / shareCount;

      // Creditor gets credit
      if (balances[payerId] !== undefined) {
        balances[payerId] += amount;
      }

      // Debtors get debited
      exp.sharedWith.forEach((shId) => {
        if (balances[shId] !== undefined) {
          balances[shId] -= individualShare;
        }
      });
    });

    return balances;
  };

  const getOptimalSettlements = () => {
    const balances = calculateBalances();
    const activeBalances = participants.map((p) => {
      const balanceVal = balances[p.id] ?? 0;
      return {
        id: p.id,
        name: p.name,
        balance: Math.round(balanceVal * 100) / 100,
      };
    });

    const debtors = activeBalances
      .filter((x) => x.balance < -0.01)
      .sort((a, b) => a.balance - b.balance);
    const creditors = activeBalances
      .filter((x) => x.balance > 0.01)
      .sort((a, b) => b.balance - a.balance);

    const transactions: { from: string; to: string; amount: number }[] = [];

    let dIdx = 0;
    let cIdx = 0;

    // Deep copy balances to modify them
    const dBalances = debtors.map((d) => ({ ...d, balance: Math.abs(d.balance) }));
    const cBalances = creditors.map((c) => ({ ...c, balance: c.balance }));

    while (dIdx < dBalances.length && cIdx < cBalances.length) {
      const debtor = dBalances[dIdx];
      const creditor = cBalances[cIdx];
      if (!debtor || !creditor) break;

      const transferAmount = Math.min(debtor.balance, creditor.balance);
      if (transferAmount > 0.01) {
        transactions.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(transferAmount * 100) / 100,
        });
      }

      debtor.balance -= transferAmount;
      creditor.balance -= transferAmount;

      if (debtor.balance <= 0.01) dIdx++;
      if (creditor.balance <= 0.01) cIdx++;
    }

    return transactions;
  };

  // Calculations for SalzburgerLand Card Calculator
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

  // Update participant name
  const handleUpdateParticipantName = (id: string, newName: string) => {
    if (!newName.trim()) return;
    setParticipants(
      participants.map((p) => {
        if (p.id !== id) return p;
        return { ...p, name: newName.trim() };
      }),
    );
  };

  // Edit Itinerary Notes
  const handleSaveItineraryNote = (key: string, value: string) => {
    setItineraryNotes({
      ...itineraryNotes,
      [key]: value,
    });
  };



  // Weather display list processing for the specific trip week: 4.7. - 10.7.2026
  const displayWeather = (() => {
    const targetDates = [
      { dateKey: '2026-07-04', dayLabel: 'So 4.7.' },
      { dateKey: '2026-07-05', dayLabel: 'Ne 5.7.' },
      { dateKey: '2026-07-06', dayLabel: 'Po 6.7.' },
      { dateKey: '2026-07-07', dayLabel: 'Út 7.7.' },
      { dateKey: '2026-07-08', dayLabel: 'St 8.7.' },
      { dateKey: '2026-07-09', dayLabel: 'Čt 9.7.' },
      { dateKey: '2026-07-10', dayLabel: 'Pá 10.7.' },
    ];

    return targetDates.map((target) => {
      // Find matching date in the API response
      const matchedApiDay = weatherForecast.find((dayData: any) => {
        if (!dayData?.interval?.startTime) return false;
        const dateObj = new Date(dayData.interval.startTime);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate === target.dateKey;
      });

      if (matchedApiDay) {
        const maxTemp = matchedApiDay.maxTemperature?.degrees;
        const minTemp = matchedApiDay.minTemperature?.degrees;
        const temp =
          maxTemp !== undefined && minTemp !== undefined
            ? `${Math.round(maxTemp)}° / ${Math.round(minTemp)}°C`
            : maxTemp !== undefined
              ? `${Math.round(maxTemp)}°C`
              : 'N/A';

        const desc = matchedApiDay.daytimeForecast?.weatherCondition?.description?.text || 'N/A';
        const iconBaseUri = matchedApiDay.daytimeForecast?.weatherCondition?.iconBaseUri;
        const iconUrl = iconBaseUri ? `${iconBaseUri}.png` : null;

        const isRain =
          desc.toLowerCase().includes('déšť') ||
          desc.toLowerCase().includes('sráž') ||
          desc.toLowerCase().includes('přeháň') ||
          desc.toLowerCase().includes('bouř');

        return {
          day: target.dayLabel,
          temp,
          desc,
          iconUrl,
          icon: isRain ? 'CloudRain' : 'Sun',
          color: isRain ? 'text-sky-500' : 'text-amber-500',
          isOnline: true,
        };
      }

      const fallback = {
        temp: 'N/A',
        desc: 'N/A',
        icon: 'Cloud',
        color: 'text-slate-400',
      };

      return {
        day: target.dayLabel,
        temp: fallback.temp,
        desc: fallback.desc,
        iconUrl: null,
        icon: fallback.icon,
        color: fallback.color,
        isOnline: false,
      };
    });
  })();

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-2 h-8 w-8 animate-spin text-emerald-600" />
          <p className="font-mono text-sm text-slate-500">Načítám turistický tahák...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-slate-50 text-slate-800 selection:bg-emerald-200 selection:text-emerald-900"
      id="main_container"
    >
      {/* Top Brand Banner & Info */}
      <header
        className="relative shrink-0 overflow-hidden border-b border-slate-800 bg-slate-900 px-4 py-6 text-white md:px-8"
        id="header"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-900 to-slate-900" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              <Mountain className="h-3.5 w-3.5" /> Rakousko &bull; Kaprun 2026
            </span>
            <h1
              className="font-display mb-1 text-3xl font-bold tracking-tight text-white"
              id="main_title"
            >
              Průvodce & Tahák do kapsy
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-slate-400">
              <MapPin className="h-4 w-4 shrink-0 text-emerald-500" /> Společná dovolená | 4 dospělí
              | Pension Baranekhof
            </p>
          </div>

          {/* Countdown timer */}
          <div className="flex min-w-[240px] items-center gap-3 self-start rounded-xl border border-slate-700/50 bg-slate-800/80 p-3.5 backdrop-blur md:self-auto">
            <Clock className="h-5 w-5 shrink-0 animate-pulse text-emerald-400" />
            <div className="flex-1">
              {isVacationOver ? (
                <div className="font-mono text-xs text-slate-400">
                  Dovolená úspěšně skončila! 🎉
                </div>
              ) : isVacationActive ? (
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                  <Flame className="h-4 w-4 shrink-0 text-amber-500" /> DOVOLENÁ PRÁVĚ PROBÍHÁ! 🥾
                </div>
              ) : (
                <div>
                  <div className="mb-1 font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                    Odjezd do Kaprunu za:
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center font-mono text-white">
                    <div>
                      <span className="block text-sm font-bold">{timeLeft.days}</span>
                      <span className="text-[9px] text-slate-500">dní</span>
                    </div>
                    <div>
                      <span className="block text-sm font-bold">{timeLeft.hours}</span>
                      <span className="text-[9px] text-slate-500">hod</span>
                    </div>
                    <div>
                      <span className="block text-sm font-bold">{timeLeft.minutes}</span>
                      <span className="text-[9px] text-slate-500">min</span>
                    </div>
                    <div>
                      <span className="block text-sm font-bold">{timeLeft.seconds}</span>
                      <span className="text-[9px] text-slate-500">sek</span>
                    </div>
                  </div>
                </div>
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
          <button
            id="tab_overview"
            onClick={() => setActiveTab('overview')}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
              activeTab === 'overview'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm'
                : 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-4 w-4" /> Program & Info
          </button>
          <button
            id="tab_hikes"
            onClick={() => setActiveTab('hikes')}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
              activeTab === 'hikes'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm'
                : 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Compass className="h-4 w-4" /> Trasy Mapy.cz
          </button>
          <button
            id="tab_card"
            onClick={() => setActiveTab('card')}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
              activeTab === 'card'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm'
                : 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <CreditCard className="h-4 w-4" /> Salzburger Card
          </button>


          <Link
            id="tab_map"
            href="/map"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900"
          >
            <Map className="h-4 w-4 text-emerald-600" /> Mapa destinací
          </Link>
        </div>
      </nav>

      {/* Main Responsive Area */}
      <main
        className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 md:py-8"
        id="main_content"
      >
        <AnimatePresence mode="wait">
          {/* TAB 1: OVERVIEW & PROGRAM */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Weather Forecast Panel */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="animate-spin-slow h-5 w-5 text-amber-500" />
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      Předpověď počasí Kaprun
                    </h3>
                  </div>
                  {isWeatherLoading ? (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <RefreshCw className="h-3 w-3 animate-spin" /> Načítám online...
                    </span>
                  ) : weatherForecast.length > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100/50 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{' '}
                      Live Online
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Typické alpské klima</span>
                  )}
                </div>

                {isWeatherLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
                    <p className="text-xs text-slate-400">
                      Stahuji aktuální data z Google Weather...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-7">
                    {displayWeather.map((w, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-3 text-center transition-all hover:bg-slate-100/50"
                      >
                        <span className="text-xs font-semibold text-slate-500">{w.day}</span>
                        {w.iconUrl ? (
                          <img
                            src={w.iconUrl}
                            alt={w.desc}
                            className="my-1 h-8 w-8 object-contain"
                          />
                        ) : w.icon === 'Sun' ? (
                          <Sun className={`my-2 h-6 w-6 ${w.color}`} />
                        ) : w.icon === 'Cloud' ? (
                          <Cloud className={`my-2 h-6 w-6 ${w.color}`} />
                        ) : (
                          <CloudRain className={`my-2 h-6 w-6 ${w.color}`} />
                        )}
                        <span className="text-sm font-bold text-slate-800">{w.temp}</span>
                        <span
                          className="text-slate-450 mt-0.5 line-clamp-1 text-[10px]"
                          title={w.desc}
                        >
                          {w.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-3 flex items-start gap-1 text-xs text-slate-500">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span>
                    V Alpách platí pravidlo: vyrazit na túru brzy ráno! Po obědě se v červenci často
                    tvoří bouřky a mlha. V případě deště využijte Tauern Spa (vnitřní areál) nebo
                    Kaprunské muzeum v centru obce.
                  </span>
                </p>
              </div>

              {/* Destinations List Section */}
              <div className="space-y-4">
                <h3 className="font-display flex items-center gap-2 text-xl font-bold text-slate-900">
                  <Compass className="h-5 w-5 animate-pulse text-emerald-600" /> Seznam destinací &
                  plánovaných cílů
                </h3>

                <div className="space-y-3">
                  {destinations.map((dest) => {
                    const isExpanded = expandedDay === dest.id;
                    const noteValue = itineraryNotes[dest.noteKey] || '';

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
                              <div className="font-mono text-[10px] font-semibold tracking-wider text-emerald-600 uppercase">
                                {dest.type}
                              </div>
                              <h4 className="text-base leading-snug font-bold text-slate-900">
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
                                    <span className="mb-1 block font-mono text-[11px] tracking-wider text-slate-400 uppercase">
                                      O místě
                                    </span>
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
                                  {(dest.cableCarHours ||
                                    dest.cableCarDuration ||
                                    dest.dogPrice) && (
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

                                  <div className="space-y-1.5">
                                    <label className="block font-mono text-[11px] tracking-wider text-slate-400 uppercase">
                                      Moje poznámky / plán pro toto místo:
                                    </label>
                                    <textarea
                                      value={noteValue}
                                      onChange={(e) =>
                                        handleSaveItineraryNote(dest.noteKey, e.target.value)
                                      }
                                      placeholder="Zapište si kdy sem chcete jít, co nakoupit, rezervace..."
                                      className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                      rows={2}
                                    />
                                  </div>
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

              {/* Hotel & Location Overview */}
              <div
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                id="overview_cards_grid"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-wider text-emerald-600 uppercase">
                    <MapPin className="h-4 w-4" /> Ubytování
                  </div>
                  <h3 className="font-display mb-1 text-xl font-bold text-slate-900">
                    Pension Baranekhof
                  </h3>
                  <p className="mb-4 text-sm text-slate-500">
                    Spatlahnerweg 13, 5710 Kaprun, Rakousko
                  </p>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 font-semibold text-slate-800">
                        Výhody pensionu:
                      </span>
                      <span>
                        Český personál, skvělé zázemí pro turisty, rodinná atmosféra, vydatné
                        snídaně.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 font-semibold text-slate-800">Check-in:</span>
                      <span>Od 14:00 (kontaktujte předem v případě pozdního příjezdu).</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <a
                    href="https://mapy.com/cs/turisticka?source=osm&id=1072899509"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/50 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Baranekhof na Mapy.cz
                  </a>
                  <a
                    href="https://baranekresorts.com/cs/dum/baranekhof"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Webová prezentace{' '}
                    <span className="font-normal text-slate-400">(CZ)</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: HIKES & MAPY.CZ LINKS */}
          {activeTab === 'hikes' && (
            <motion.div
              key="hikes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-display mb-2 text-lg font-bold text-slate-900">
                  Jak pracovat s trasami
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Pro rakouskou turistiku jsou mapové podklady od <strong>Mapy.cz</strong> naprosto
                  bezkonkurenční. Mají detailně vykreslené vrstevnice, turistické značky,
                  rozcestníky i horské chaty. Kliknutím na tlačítka níže otevřete naplánované trasy
                  přímo v aplikaci Mapy.cz na svém telefonu, kde můžete spustit offline navigaci.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-display flex items-center gap-2 text-xl font-bold text-slate-900">
                  <Compass className="h-5 w-5 text-emerald-600" /> Naplánované trasy & Výlety
                </h3>

                {/* Route 1 */}
                <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row">
                  <div className="flex-1">
                    <span className="mb-2 inline-block rounded bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800 uppercase">
                      Trasa 1: Cyklo / Pěší okruh kolem Zell am See
                    </span>
                    <h4 className="font-display mb-2 text-lg font-bold text-slate-900">
                      Okruh Zell am See – Bruck údolím
                    </h4>
                    <p className="mb-4 text-sm leading-relaxed text-slate-600">
                      Nádherná trasa vedoucí údolím řeky Salzach a podél malebného jižního břehu
                      jezera Zell am See. Vhodná jak pro pěší procházku, tak pro pohodovou
                      cykloturistiku. Trasa začíná v Brucku an der Großglocknerstraße a vede kolem
                      břehů jezera.
                    </p>

                    <div className="mb-2 flex flex-wrap gap-4 font-mono text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-400" /> Délka: 11 km
                      </div>
                      <div className="flex items-center gap-1">
                        <Mountain className="h-4 w-4 text-slate-400" /> Čas: 2:48 hod (pěšky)
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-slate-400" /> Převýšení: +14 m
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col justify-center gap-2 md:w-48">
                    <a
                      href="https://mapy.com/cs/turisticka?planovani-trasy&rc=9dVMaxKKxS575adY-fxKNO2dtKeP5&rs=osm&rs=pubt&rs=osm&rs=osm&ri=150040160&ri=28043547&ri=1040825275&ri=1063743585&mrp=%7B%22c%22%3A132%2C%22dt%22%3A%22%22%2C%22d%22%3Atrue%7D&xc=%5B%5D&x=12.8004831&y=47.3276843&z=14"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                    >
                      <Navigation className="h-4 w-4" /> Spustit v Mapy.cz
                    </a>
                    <span className="text-center font-mono text-[10px] text-slate-400">
                      Bruck & Zell am See
                    </span>
                  </div>
                </div>

                {/* Route 2 */}
                <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row">
                  <div className="flex-1">
                    <span className="mb-2 inline-block rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 uppercase">
                      Trasa 2: Hlavní pěší okruh Sigmund-Thun-Klamm & Maiskogel
                    </span>
                    <h4 className="font-display mb-2 text-lg font-bold text-slate-900">
                      Okruh přes soutěsku, Klammsee a na Maiskogel
                    </h4>
                    <p className="mb-4 text-sm leading-relaxed text-slate-600">
                      Naprosto fantastická a rozmanitá pěší trasa přímo od pensionu. Projdete
                      divokou dřevěnou soutěskou Sigmund-Thun-Klamm, obejdete tyrkysové jezero
                      Klammsee s možností občerstvení a vystoupáte na panorama rodinné hory
                      Maiskogel, odkud jsou vidět dechberoucí třítisícovky. Dolů lze sejít nebo sjet
                      lanovkou.
                    </p>

                    <div className="mb-2 flex flex-wrap gap-4 font-mono text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-400" /> Délka: 13,9 km
                      </div>
                      <div className="flex items-center gap-1">
                        <Mountain className="h-4 w-4 text-slate-400" /> Čas: 4:31 hod
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-slate-400" /> Převýšení: +395 m
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col justify-center gap-2 md:w-48">
                    <a
                      href="https://mapy.com/cs/turisticka?planovani-trasy&rc=9dKi3xJmA0hNLmZoOVSLgos59T57.hclfGidvs3ffeg4VHf6VEpfVzfRd3r9ezQcsh&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=coor&rs=coor&rs=osm&ri=1072899509&ri=12020854&ri=1107825757&ri=6715739&ri=6156123&ri=1049234303&ri=1118849373&ri=1049369690&ri=&ri=&ri=1270567980&mrp=%7B%22c%22%3A132%2C%22dt%22%3A%22%22%2C%22d%22%3Atrue%7D&xc=%5B%5D&x=12.7381533&y=47.2539451&z=15"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                    >
                      <Navigation className="h-4 w-4" /> Spustit v Mapy.cz
                    </a>
                    <span className="text-center font-mono text-[10px] text-slate-400">
                      Okruh přímo v Kaprunu
                    </span>
                  </div>
                </div>

                {/* Route 3 */}
                <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row">
                  <div className="flex-1">
                    <span className="mb-2 inline-block rounded bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-800 uppercase">
                      Trasa 3: Panoramatická severní trasa Piesendorf
                    </span>
                    <h4 className="font-display mb-2 text-lg font-bold text-slate-900">
                      Výhledová stezka nad Piesendorfem
                    </h4>
                    <p className="mb-4 text-sm leading-relaxed text-slate-600">
                      Tato výhledová trasa vede po severních prosluněných stráních nad údolím mezi
                      Kaprunem a Piesendorfem. Poskytuje jedny z nejkrásnějších fotografických
                      výhledů na protější ledovcový masiv Kitzsteinhornu a vrcholky národního parku
                      Vysoké Taury. Středně náročná trasa s příjemným sklonem.
                    </p>

                    <div className="mb-2 flex flex-wrap gap-4 font-mono text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-400" /> Délka: 16 km
                      </div>
                      <div className="flex items-center gap-1">
                        <Mountain className="h-4 w-4 text-slate-400" /> Čas: 6:52 hod
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-slate-400" /> Převýšení: +1 059 m
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col justify-center gap-2 md:w-48">
                    <a
                      href="https://mapy.com/cs/turisticka?planovani-trasy&rc=9dRWPxKMEXaUQgsBiLAkZShxo3BVhIDdiH&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&ri=1031805746&ri=13075246&ri=6474142&ri=1104832415&ri=10590958&mrp=%7B%22c%22%3A132%2C%22dt%22%3A%22%22%2C%22d%22%3Atrue%7D&xc=%5B%5D&x=12.7690241&y=47.3312090&z=14"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                    >
                      <Navigation className="h-4 w-4" /> Spustit v Mapy.cz
                    </a>
                    <span className="text-center font-mono text-[10px] text-slate-400">
                      Piesendorf & sever Kaprunu
                    </span>
                  </div>
                </div>
              </div>

              {/* Points of Interest (Baranekhof, Reservoirs, Tauern Spa etc) */}
              <div className="space-y-4">
                <h3 className="font-display flex items-center gap-2 text-xl font-bold text-slate-900">
                  <MapPin className="h-5 w-5 text-emerald-600" /> Klíčová místa na mapě
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      name: 'Ubytování: Pension Baranekhof',
                      desc: 'Náš český základní tábor v Kaprunu.',
                      url: 'https://mapy.com/cs/turisticka?source=osm&id=1072899509',
                    },
                    {
                      name: 'Soutěska Sigmund-Thun-Klamm',
                      desc: 'Dřevěné lávky nad burácející ledovcovou řekou.',
                      url: 'https://mapy.com/cs/turisticka?source=osm&id=12020854',
                    },
                    {
                      name: 'Lanovka MK Maiskogelbahn',
                      desc: 'Spodní stanice lanovky na rodinnou horu Maiskogel.',
                      url: 'https://mapy.com/cs/turisticka?source=osm&id=1066791681',
                    },
                    {
                      name: 'Vysokohorské přehrady Mooserboden',
                      desc: 'Monumentální přehrady ve výšce 2040 m n. m.',
                      url: 'https://mapy.com/cs/turisticka?source=osm&id=96102629',
                    },
                    {
                      name: 'Termální lázně Tauern Spa',
                      desc: 'Moderní bazénový a wellness komplex v Kaprunu.',
                      url: 'https://mapy.com/cs/turisticka?source=osm&id=1025788061',
                    },
                  ].map((poi, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div>
                        <h5 className="mb-1 text-sm font-bold text-slate-900">{poi.name}</h5>
                        <p className="mb-3 text-xs text-slate-500">{poi.desc}</p>
                      </div>
                      <a
                        href={poi.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        Otevřít bod na mapě <ChevronRight className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: SALZBURGERLAND CARD CALCULATOR */}
          {activeTab === 'card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    Plánované atrakce
                  </h4>
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
                      Kartu lze zakoupit online v digitální podobě do mobilního telefonu nebo
                      fyzicky na infocentru v Kaprunu.
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
            </motion.div>
          )}


        </AnimatePresence>

        {/* Persistent Emergency Quick Reference / Help */}
        <div
          className="shrink-0 space-y-3 rounded-2xl bg-slate-900 p-5 text-slate-100 shadow-sm"
          id="emergency_ref"
        >
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-rose-400 uppercase">
            <AlertTriangle className="h-4 w-4" /> Nouzové kontakty & Rychlý tahák
          </div>
          <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="mb-1 block text-slate-400">Horská služba Rakousko:</span>
              <span className="block text-sm font-bold text-white">📞 140</span>
              <span className="text-[10px] text-slate-400">Evropská pohotovost: 112</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="mb-1 block text-slate-400">Sídlo ubytování:</span>
              <span className="block text-sm font-bold text-white">Pension Baranekhof</span>
              <span className="text-[10px] text-slate-400">Spatlahnerweg 13, Kaprun</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="mb-1 block text-slate-400">Místní lékárna:</span>
              <span className="block text-sm font-bold text-white">Apotheke Kaprun</span>
              <span className="text-[10px] text-slate-400">Sigmund-Thun-Straße 22</span>
            </div>
          </div>
        </div>
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
