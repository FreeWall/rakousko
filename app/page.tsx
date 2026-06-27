'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Compass,
  CheckSquare,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Info,
  ExternalLink,
  MessageSquare,
  Send,
  Sparkles,
  RefreshCw,
  Clock,
  Navigation,
  Sun,
  CloudRain,
  Cloud,
  Mountain,
  HelpCircle,
  AlertTriangle,
  Award,
  Flame,
  Map
} from 'lucide-react';
import Link from 'next/link';

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

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

import { Destination, destinations } from '@/lib/destinations';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'hikes' | 'card' | 'ai'>('overview');

  // Time States
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVacationOver, setIsVacationOver] = useState(false);
  const [isVacationActive, setIsVacationActive] = useState(false);

  // Group / Splitter States
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Tomáš' },
    { id: '2', name: 'Lucie' },
    { id: '3', name: 'Honza' },
    { id: '4', name: 'Klára' }
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
    'boat'
  ]);

  const cardPricePerAdult = 95.0; // Estimate for a 6-day SalzburgerLand Card in 2026
  const groupSize = 4;

  const attractionsList = [
    { id: 'kitzsteinhorn', name: 'Ledovec Kitzsteinhorn (Lanovka & Panorama)', normalPrice: 54.0, category: 'Lanovka' },
    { id: 'schmittenhohe', name: 'Schmittenhöhe kabinková lanovka (Zell am See)', normalPrice: 42.0, category: 'Lanovka' },
    { id: 'reservoirs', name: 'Kaprunské přehrady (Mooserboden autobus + výtah)', normalPrice: 28.5, category: 'Příroda' },
    { id: 'sigmund', name: 'Soutěska Sigmund-Thun-Klamm', normalPrice: 7.5, category: 'Příroda' },
    { id: 'boat', name: 'Plavba lodí po jezeře Zell am See', normalPrice: 22.0, category: 'Zážitek' },
    { id: 'krimml', name: 'Krimmlské vodopády (vstup do soutěsky & park)', normalPrice: 12.0, category: 'Příroda' },
    { id: 'tauern', name: 'Tauern Spa Kaprun (Sleva/Vstup s kartou)', normalPrice: 35.0, category: 'Relax' },
    { id: 'kitzloch', name: 'Soutěska Kitzlochklamm', normalPrice: 9.0, category: 'Příroda' },
    { id: 'wildlife', name: 'Wild & Freizeitpark Ferleiten', normalPrice: 15.5, category: 'Zážitek' }
  ];

  // AI Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Ahoj! Jsem váš osobní horský průvodce pro Kaprun a okolí. Mám v kapse informace o vašem ubytování v Pensionu Baranekhof, všech 3 naplánovaných trasách z Mapy.cz, o výhodách SalzburgerLand Card a o tom, co dělat, když začne v Alpách pršet. Na co se chcete zeptat?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Expanded Destination state in Overview
  const [expandedDay, setExpandedDay] = useState<string | null>('kitzsteinhorn');

  // Weather Online States
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 'AIzaSyDI6JLAqH6qrMk-PvRKrAC5cLxX3rDpquI';
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
        if (tab && ['overview', 'hikes', 'card', 'ai'].includes(tab)) {
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

  // Scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      sharedWith: newExpenseShared.length > 0 ? newExpenseShared : participants.map(p => p.id)
    };

    setExpenses([...expenses, newExpense]);
    setNewExpenseDesc('');
    setNewExpenseAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleToggleSharedWith = (pId: string) => {
    if (newExpenseShared.includes(pId)) {
      setNewExpenseShared(newExpenseShared.filter(id => id !== pId));
    } else {
      setNewExpenseShared([...newExpenseShared, pId]);
    }
  };

  const calculateBalances = () => {
    const balances: Record<string, number> = {};
    // Initialize
    participants.forEach(p => {
      balances[p.id] = 0;
    });

    // Run calculations
    expenses.forEach(exp => {
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
      exp.sharedWith.forEach(shId => {
        if (balances[shId] !== undefined) {
          balances[shId] -= individualShare;
        }
      });
    });

    return balances;
  };

  const getOptimalSettlements = () => {
    const balances = calculateBalances();
    const activeBalances = participants.map(p => ({
      id: p.id,
      name: p.name,
      balance: Math.round(balances[p.id] * 100) / 100
    }));

    const debtors = activeBalances.filter(x => x.balance < -0.01).sort((a, b) => a.balance - b.balance);
    const creditors = activeBalances.filter(x => x.balance > 0.01).sort((a, b) => b.balance - a.balance);

    const transactions: { from: string; to: string; amount: number }[] = [];

    let dIdx = 0;
    let cIdx = 0;

    // Deep copy balances to modify them
    const dBalances = debtors.map(d => ({ ...d, balance: Math.abs(d.balance) }));
    const cBalances = creditors.map(c => ({ ...c, balance: c.balance }));

    while (dIdx < dBalances.length && cIdx < cBalances.length) {
      const debtor = dBalances[dIdx];
      const creditor = cBalances[cIdx];

      const transferAmount = Math.min(debtor.balance, creditor.balance);
      if (transferAmount > 0.01) {
        transactions.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(transferAmount * 100) / 100
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
      setSelectedAttractions(selectedAttractions.filter(x => x !== id));
    } else {
      setSelectedAttractions([...selectedAttractions, id]);
    }
  };

  const calculateCardSavings = () => {
    const totalNormalPricePerAdult = attractionsList
      .filter(a => selectedAttractions.includes(a.id))
      .reduce((acc, curr) => acc + curr.normalPrice, 0);

    const totalNormalPriceGroup = totalNormalPricePerAdult * groupSize;
    const totalCardCostGroup = cardPricePerAdult * groupSize;
    const totalSavingsGroup = totalNormalPriceGroup - totalCardCostGroup;

    return {
      normalPerAdult: totalNormalPricePerAdult,
      normalGroup: totalNormalPriceGroup,
      cardGroup: totalCardCostGroup,
      savingsGroup: totalSavingsGroup,
      isProfitable: totalSavingsGroup > 0
    };
  };

  const savingsStats = calculateCardSavings();


  // Update participant name
  const handleUpdateParticipantName = (id: string, newName: string) => {
    if (!newName.trim()) return;
    setParticipants(
      participants.map(p => {
        if (p.id !== id) return p;
        return { ...p, name: newName.trim() };
      })
    );
  };

  // Edit Itinerary Notes
  const handleSaveItineraryNote = (key: string, value: string) => {
    setItineraryNotes({
      ...itineraryNotes,
      [key]: value
    });
  };

  // Ask AI Action
  const handleSendMessage = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || inputValue;
    if (!promptToSend.trim() || isAiLoading) return;

    const userMessage: Message = { role: 'user', content: promptToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err: any) {
      console.error('Error fetching from AI:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Omlouvám se, ale nepodařilo se mi spojit se serverem. Zkontrolujte prosím připojení k internetu a zkuste to znovu.'
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
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
      { dateKey: '2026-07-10', dayLabel: 'Pá 10.7.' }
    ];

    return targetDates.map(target => {
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
        const temp = maxTemp !== undefined && minTemp !== undefined
          ? `${Math.round(maxTemp)}° / ${Math.round(minTemp)}°C`
          : maxTemp !== undefined
            ? `${Math.round(maxTemp)}°C`
            : 'N/A';

        const desc = matchedApiDay.daytimeForecast?.weatherCondition?.description?.text || 'N/A';
        const iconBaseUri = matchedApiDay.daytimeForecast?.weatherCondition?.iconBaseUri;
        const iconUrl = iconBaseUri ? `${iconBaseUri}.png` : null;

        const isRain = desc.toLowerCase().includes('déšť') ||
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
          isOnline: true
        };
      }

      const fallback = {
        temp: 'N/A',
        desc: 'N/A',
        icon: 'Cloud',
        color: 'text-slate-400'
      };

      return {
        day: target.dayLabel,
        temp: fallback.temp,
        desc: fallback.desc,
        iconUrl: null,
        icon: fallback.icon,
        color: fallback.color,
        isOnline: false
      };
    });
  })();

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500 font-mono">Načítám turistický tahák...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-200 selection:text-emerald-900" id="main_container">
      {/* Top Brand Banner & Info */}
      <header className="bg-slate-900 text-white border-b border-slate-800 py-6 px-4 md:px-8 relative overflow-hidden shrink-0" id="header">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between relative z-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <Mountain className="w-3.5 h-3.5" /> Rakousko &bull; Kaprun 2026
            </span>
            <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-1" id="main_title">
              Průvodce & Tahák do kapsy
            </h1>
            <p className="text-slate-400 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" /> Společná dovolená | 4 dospělí | Pension Baranekhof
            </p>
          </div>

          {/* Countdown timer */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-xl p-3.5 flex items-center gap-3 self-start md:self-auto min-w-[240px]">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
            <div className="flex-1">
              {isVacationOver ? (
                <div className="text-xs font-mono text-slate-400">Dovolená úspěšně skončila! 🎉</div>
              ) : isVacationActive ? (
                <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <Flame className="w-4 h-4 text-amber-500 shrink-0" /> DOVOLENÁ PRÁVĚ PROBÍHÁ! 🥾
                </div>
              ) : (
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">Odjezd do Kaprunu za:</div>
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
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-2 md:px-8 py-2.5 overflow-x-auto scrollbar-none flex justify-start md:justify-center shrink-0" id="navigation_bar">
        <div className="flex gap-1.5 max-w-4xl w-full">
          <button
            id="tab_overview"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 border ${
              activeTab === 'overview'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" /> Program & Info
          </button>
          <button
            id="tab_hikes"
            onClick={() => setActiveTab('hikes')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 border ${
              activeTab === 'hikes'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" /> Trasy Mapy.cz
          </button>
          <button
            id="tab_card"
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 border ${
              activeTab === 'card'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Salzburger Card
          </button>

          <button
            id="tab_ai"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 border ${
              activeTab === 'ai'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-500" /> AI Průvodce
          </button>
          <Link
            id="tab_map"
            href="/map"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 border bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-200"
          >
            <Map className="w-4 h-4 text-emerald-600" /> Mapa destinací
          </Link>
        </div>
      </nav>

      {/* Main Responsive Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col gap-6 overflow-y-auto" id="main_content">
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
              {/* Hotel & Location Overview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between" id="overview_cards_grid">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">
                    <MapPin className="w-4 h-4" /> Ubytování
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-1">Pension Baranekhof</h3>
                  <p className="text-sm text-slate-500 mb-4">Spatlahnerweg 13, 5710 Kaprun, Rakousko</p>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-slate-800 shrink-0">Výhody pensionu:</span>
                      <span>Český personál, skvělé zázemí pro turisty, rodinná atmosféra, vydatné snídaně.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-slate-800 shrink-0">Check-in:</span>
                      <span>Od 14:00 (kontaktujte předem v případě pozdního příjezdu).</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  <a
                    href="https://mapy.com/cs/turisticka?source=osm&id=1072899509"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Baranekhof na Mapy.cz
                  </a>
                  <a
                    href="https://baranekresorts.com/cs/dum/baranekhof"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Webová prezentace <span className="text-slate-400 font-normal">(CZ)</span>
                  </a>
                </div>
              </div>

              {/* Weather Forecast Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
                    <h3 className="text-lg font-bold font-display text-slate-900">Předpověď počasí Kaprun</h3>
                  </div>
                  {isWeatherLoading ? (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Načítám online...
                    </span>
                  ) : weatherForecast.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Online
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Typické alpské klima</span>
                  )}
                </div>

                {isWeatherLoading ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
                    <p className="text-xs text-slate-400">Stahuji aktuální data z Google Weather...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
                    {displayWeather.map((w, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center flex flex-col items-center justify-center transition-all hover:bg-slate-100/50">
                        <span className="text-xs font-semibold text-slate-500">{w.day}</span>
                        {w.iconUrl ? (
                          <img src={w.iconUrl} alt={w.desc} className="w-8 h-8 my-1 object-contain" />
                        ) : w.icon === 'Sun' ? (
                          <Sun className={`w-6 h-6 my-2 ${w.color}`} />
                        ) : w.icon === 'Cloud' ? (
                          <Cloud className={`w-6 h-6 my-2 ${w.color}`} />
                        ) : (
                          <CloudRain className={`w-6 h-6 my-2 ${w.color}`} />
                        )}
                        <span className="text-sm font-bold text-slate-800">{w.temp}</span>
                        <span className="text-[10px] text-slate-450 mt-0.5 line-clamp-1" title={w.desc}>{w.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-3 flex items-start gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>V Alpách platí pravidlo: vyrazit na túru brzy ráno! Po obědě se v červenci často tvoří bouřky a mlha. V případě deště využijte Tauern Spa (vnitřní areál) nebo Kaprunské muzeum v centru obce.</span>
                </p>
              </div>

              {/* Destinations List Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-600 animate-pulse" /> Seznam destinací & plánovaných cílů
                </h3>

                <div className="space-y-3">
                  {destinations.map((dest) => {
                    const isExpanded = expandedDay === dest.id;
                    const noteValue = itineraryNotes[dest.noteKey] || '';

                    return (
                      <div key={dest.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-slate-300">
                        {/* Destination Header Trigger */}
                        <button
                          onClick={() => setExpandedDay(isExpanded ? null : dest.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="bg-emerald-50 text-emerald-700 rounded-xl p-2.5 shrink-0 flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="text-[10px] text-emerald-600 font-mono tracking-wider uppercase font-semibold">{dest.type}</div>
                              <h4 className="text-base font-bold text-slate-900 leading-snug">{dest.name}</h4>
                            </div>
                          </div>
                          <div className="text-slate-400 ml-4 shrink-0">
                            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                          </div>
                        </button>

                        {/* Destination Content */}
                        {isExpanded && (
                          <div className="px-5 pb-5 border-t border-slate-100 bg-slate-50/30">
                            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                              {/* Left Side: Description & Highlights */}
                              <div className="space-y-3">
                                <div>
                                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">O místě</span>
                                  <p className="text-sm text-slate-600 leading-relaxed">{dest.description}</p>
                                </div>

                                <div>
                                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">Hlavní lákadla</span>
                                  <ul className="space-y-2">
                                    {dest.highlights.map((highlight, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                                        <span>{highlight}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* Right Side: Tips, SalzburgerLand Card & Notes */}
                              <div className="flex flex-col gap-4 justify-between">
                                <div className="space-y-3">
                                  {/* Tips */}
                                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-800">
                                    <div className="font-bold flex items-center gap-1.5 mb-1">
                                      <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Doporučení & Tipy
                                    </div>
                                    <p className="leading-relaxed">{dest.tips}</p>
                                  </div>

                                  {/* SalzburgerLand Card Info */}
                                  {dest.slCardInfo && (
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1.5">
                                        <CreditCard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                        <span><strong>SalzburgerLand Card:</strong> {dest.slCardInfo}</span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Cable car operating details and dog price */}
                                  {(dest.cableCarHours || dest.cableCarDuration || dest.dogPrice) && (
                                    <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 space-y-2">
                                      <div className="font-bold flex items-center gap-1.5 text-slate-800">
                                        <Mountain className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Detaily dopravy / lanovky
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                                        {dest.cableCarHours && (
                                          <div>
                                            <span className="text-[10px] uppercase font-mono text-slate-400 block leading-tight">Provoz</span>
                                            <span className="font-medium text-slate-900">{dest.cableCarHours}</span>
                                          </div>
                                        )}
                                        {dest.cableCarDuration && (
                                          <div>
                                            <span className="text-[10px] uppercase font-mono text-slate-400 block leading-tight">Doba jízdy</span>
                                            <span className="font-medium text-slate-900">{dest.cableCarDuration}</span>
                                          </div>
                                        )}
                                        {dest.dogPrice && (
                                          <div>
                                            <span className="text-[10px] uppercase font-mono text-slate-400 block leading-tight">Pes</span>
                                            <span className="font-medium text-slate-900">{dest.dogPrice}</span>
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
                                          className="flex-1 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors shadow-sm justify-center"
                                        >
                                          <Navigation className="w-3.5 h-3.5" /> Trasa na Mapy.cz
                                        </a>
                                      )}
                                      {dest.webUrl && (
                                        <a
                                          href={dest.webUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex-1 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors shadow-sm justify-center border border-slate-200"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" /> Oficiální web
                                        </a>
                                      )}
                                    </div>
                                  )}

                                  <div className="space-y-1.5">
                                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                                      Moje poznámky / plán pro toto místo:
                                    </label>
                                    <textarea
                                      value={noteValue}
                                      onChange={(e) => handleSaveItineraryNote(dest.noteKey, e.target.value)}
                                      placeholder="Zapište si kdy sem chcete jít, co nakoupit, rezervace..."
                                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
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
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-lg font-bold font-display text-slate-900 mb-2">Jak pracovat s trasami</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pro rakouskou turistiku jsou mapové podklady od <strong>Mapy.cz</strong> naprosto bezkonkurenční. Mají detailně vykreslené vrstevnice, turistické značky, rozcestníky i horské chaty. Kliknutím na tlačítka níže otevřete naplánované trasy přímo v aplikaci Mapy.cz na svém telefonu, kde můžete spustit offline navigaci.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-600" /> Naplánované trasy & Výlety
                </h3>

                {/* Route 1 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 mb-2 uppercase">
                      Trasa 1: Cyklo / Pěší okruh kolem Zell am See
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 font-display">Okruh Zell am See – Bruck údolím</h4>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      Nádherná trasa vedoucí údolím řeky Salzach a podél malebného jižního břehu jezera Zell am See. Vhodná jak pro pěší procházku, tak pro pohodovou cykloturistiku. Trasa začíná v Brucku an der Großglocknerstraße a vede kolem břehů jezera.
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" /> Délka: 11 km
                      </div>
                      <div className="flex items-center gap-1">
                        <Mountain className="w-4 h-4 text-slate-400" /> Čas: 2:48 hod (pěšky)
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-slate-400" /> Převýšení: +14 m
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-2 shrink-0 md:w-48">
                    <a
                      href="https://mapy.com/cs/turisticka?planovani-trasy&rc=9dVMaxKKxS575adY-fxKNO2dtKeP5&rs=osm&rs=pubt&rs=osm&rs=osm&ri=150040160&ri=28043547&ri=1040825275&ri=1063743585&mrp=%7B%22c%22%3A132%2C%22dt%22%3A%22%22%2C%22d%22%3Atrue%7D&xc=%5B%5D&x=12.8004831&y=47.3276843&z=14"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Navigation className="w-4 h-4" /> Spustit v Mapy.cz
                    </a>
                    <span className="text-[10px] text-slate-400 text-center font-mono">Bruck & Zell am See</span>
                  </div>
                </div>

                {/* Route 2 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 mb-2 uppercase">
                      Trasa 2: Hlavní pěší okruh Sigmund-Thun-Klamm & Maiskogel
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 font-display">Okruh přes soutěsku, Klammsee a na Maiskogel</h4>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      Naprosto fantastická a rozmanitá pěší trasa přímo od pensionu. Projdete divokou dřevěnou soutěskou Sigmund-Thun-Klamm, obejdete tyrkysové jezero Klammsee s možností občerstvení a vystoupáte na panorama rodinné hory Maiskogel, odkud jsou vidět dechberoucí třítisícovky. Dolů lze sejít nebo sjet lanovkou.
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" /> Délka: 13,9 km
                      </div>
                      <div className="flex items-center gap-1">
                        <Mountain className="w-4 h-4 text-slate-400" /> Čas: 4:31 hod
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-slate-400" /> Převýšení: +395 m
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-2 shrink-0 md:w-48">
                    <a
                      href="https://mapy.com/cs/turisticka?planovani-trasy&rc=9dKi3xJmA0hNLmZoOVSLgos59T57.hclfGidvs3ffeg4VHf6VEpfVzfRd3r9ezQcsh&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=coor&rs=coor&rs=osm&ri=1072899509&ri=12020854&ri=1107825757&ri=6715739&ri=6156123&ri=1049234303&ri=1118849373&ri=1049369690&ri=&ri=&ri=1270567980&mrp=%7B%22c%22%3A132%2C%22dt%22%3A%22%22%2C%22d%22%3Atrue%7D&xc=%5B%5D&x=12.7381533&y=47.2539451&z=15"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Navigation className="w-4 h-4" /> Spustit v Mapy.cz
                    </a>
                    <span className="text-[10px] text-slate-400 text-center font-mono">Okruh přímo v Kaprunu</span>
                  </div>
                </div>

                {/* Route 3 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800 mb-2 uppercase">
                      Trasa 3: Panoramatická severní trasa Piesendorf
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 font-display">Výhledová stezka nad Piesendorfem</h4>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      Tato výhledová trasa vede po severních prosluněných stráních nad údolím mezi Kaprunem a Piesendorfem. Poskytuje jedny z nejkrásnějších fotografických výhledů na protější ledovcový masiv Kitzsteinhornu a vrcholky národního parku Vysoké Taury. Středně náročná trasa s příjemným sklonem.
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" /> Délka: 16 km
                      </div>
                      <div className="flex items-center gap-1">
                        <Mountain className="w-4 h-4 text-slate-400" /> Čas: 6:52 hod
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-slate-400" /> Převýšení: +1 059 m
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-2 shrink-0 md:w-48">
                    <a
                      href="https://mapy.com/cs/turisticka?planovani-trasy&rc=9dRWPxKMEXaUQgsBiLAkZShxo3BVhIDdiH&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&ri=1031805746&ri=13075246&ri=6474142&ri=1104832415&ri=10590958&mrp=%7B%22c%22%3A132%2C%22dt%22%3A%22%22%2C%22d%22%3Atrue%7D&xc=%5B%5D&x=12.7690241&y=47.3312090&z=14"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Navigation className="w-4 h-4" /> Spustit v Mapy.cz
                    </a>
                    <span className="text-[10px] text-slate-400 text-center font-mono">Piesendorf & sever Kaprunu</span>
                  </div>
                </div>
              </div>

              {/* Points of Interest (Baranekhof, Reservoirs, Tauern Spa etc) */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" /> Klíčová místa na mapě
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      name: 'Ubytování: Pension Baranekhof',
                      desc: 'Náš český základní tábor v Kaprunu.',
                      url: 'https://mapy.com/cs/turisticka?source=osm&id=1072899509'
                    },
                    {
                      name: 'Soutěska Sigmund-Thun-Klamm',
                      desc: 'Dřevěné lávky nad burácející ledovcovou řekou.',
                      url: 'https://mapy.com/cs/turisticka?source=osm&id=12020854'
                    },
                    {
                      name: 'Lanovka MK Maiskogelbahn',
                      desc: 'Spodní stanice lanovky na rodinnou horu Maiskogel.',
                      url: 'https://mapy.com/cs/turisticka?source=osm&id=1066791681'
                    },
                    {
                      name: 'Vysokohorské přehrady Mooserboden',
                      desc: 'Monumentální přehrady ve výšce 2040 m n. m.',
                      url: 'https://mapy.com/cs/turisticka?source=osm&id=96102629'
                    },
                    {
                      name: 'Termální lázně Tauern Spa',
                      desc: 'Moderní bazénový a wellness komplex v Kaprunu.',
                      url: 'https://mapy.com/cs/turisticka?source=osm&id=1025788061'
                    }
                  ].map((poi, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm mb-1">{poi.name}</h5>
                        <p className="text-xs text-slate-500 mb-3">{poi.desc}</p>
                      </div>
                      <a
                        href={poi.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        Otevřít bod na mapě <ChevronRight className="w-3 h-3" />
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
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                      <CreditCard className="w-3.5 h-3.5" /> SalzburgerLand Card (SL Card)
                    </span>
                    <h3 className="text-xl font-bold font-display text-slate-900">Vyplatí se nám karta?</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Karta stojí cca <strong>{cardPricePerAdult} €</strong> na 6 dní pro dospělého. Zahrnuje bezplatný vstup na více než 190 atrakcí, koupališť, hradů a lanovek v celém Salcbursku. Pojďme si spočítat úsporu pro naši 4člennou skupinu!
                    </p>
                  </div>
                  <div className="shrink-0 bg-slate-50 rounded-xl p-4 border border-slate-100 text-center md:w-48">
                    <span className="text-xs text-slate-400 font-mono block mb-1">Cena karty (dospělý)</span>
                    <span className="text-2xl font-bold text-slate-900">{cardPricePerAdult} €</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Skupina (4x): {cardPricePerAdult * 4} €</span>
                  </div>
                </div>
              </div>

              {/* Calculator Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Checklist of attractions */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm md:col-span-2 space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 font-display">Plánované atrakce</h4>
                  <p className="text-xs text-slate-500">Zaškrtněte atrakce, které na dovolené plánujete navštívit, a sledujte úsporu:</p>

                  <div className="space-y-2.5">
                    {attractionsList.map((attr) => {
                      const isSelected = selectedAttractions.includes(attr.id);
                      return (
                        <button
                          key={attr.id}
                          onClick={() => toggleAttraction(attr.id)}
                          className={`w-full text-left flex items-center justify-between p-3 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-slate-50/80 border-slate-300 shadow-sm'
                              : 'bg-white border-slate-200 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <span className="text-xs font-bold">✓</span>}
                            </div>
                            <div>
                              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 mr-2 uppercase">
                                {attr.category}
                              </span>
                              <span className="text-sm font-semibold text-slate-800">{attr.name}</span>
                            </div>
                          </div>
                          <span className="text-sm font-mono font-bold text-slate-700 ml-4 shrink-0">
                            {attr.normalPrice.toFixed(2)} €
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Savings Meter Box */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <h4 className="text-base font-bold font-display text-white mb-4">Finanční přehled (4 dospělí)</h4>

                    <div className="space-y-3.5 text-sm font-mono border-b border-white/10 pb-4 mb-4">
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
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Úspora skupiny:</span>
                      <div className={`text-3xl font-bold font-display ${savingsStats.savingsGroup > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {savingsStats.savingsGroup > 0 ? '+' : ''}{savingsStats.savingsGroup.toFixed(2)} €
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        (~ {Math.round(savingsStats.savingsGroup * 25.5)} CZK)
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    {savingsStats.savingsGroup > 0 ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                        <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                          🎉 Karta se jednoznačně VYPLATÍ!
                        </span>
                        <p className="text-[10px] text-slate-300 mt-1">Ušetříte spoustu peněz a ušetříte čas stáním ve frontách na lístky.</p>
                      </div>
                    ) : (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                        <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
                          ⚠️ Vyplatí se vám lístky kupovat jednotlivě
                        </span>
                        <p className="text-[10px] text-slate-300 mt-1">Přidejte do seznamu více lanovek (např. Schmittenhöhe nebo Kitzsteinhorn), aby se karta zaplatila.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Informational Cards about SL Card */}
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Užitečné tipy k SalzburgerLand Card:</span>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>Kartu lze zakoupit online v digitální podobě do mobilního telefonu nebo fyzicky na infocentru v Kaprunu.</li>
                    <li>S touto kartou máte navíc 1x za 6 dní možnost bezplatně projet slavnou vysokohorskou silnici <strong>Großglockner Hochalpenstraße</strong>, což je jinak zpoplatněno částkou 43 € za auto!</li>
                    <li>Karta platí i na spoustu dalších atrakcí v okolí, např. hrad Hohenwerfen, soutěsku Liechtensteinklamm či termální lázně Alpentherme v Bad Hofgasteinu.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}


          {/* TAB 6: AI HOLIDAY ASSISTANT */}
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-[600px] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="bg-emerald-500/15 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Osobní AI průvodce</h3>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Aktivní na serveru
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Powered by Gemini 3.5 Flash</span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" id="chat_box">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                        msg.role === 'user'
                          ? 'bg-slate-900 text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm leading-relaxed whitespace-pre-wrap'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1 font-mono">
                          <Compass className="w-3.5 h-3.5" /> AI Průvodce
                        </div>
                      )}
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-none p-4 text-sm shadow-sm flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                      <span className="font-mono text-xs">Průvodce přemýšlí...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggested Prompts */}
              <div className="px-4 py-2 border-t border-slate-100 flex gap-2 overflow-x-auto bg-white shrink-0 scrollbar-none">
                {[
                  { text: '🌧️ Co dělat, když prší?', q: 'Co doporučuješ dělat v Kaprunu za deštivého dne pro 4 dospělé?' },
                  { text: '❄️ Tipy na ledovec', q: 'Co přesně si sbalit na Kitzsteinhorn v červenci a co tam vidět?' },
                  { text: '🏡 Info o ubytování', q: 'Řekni mi více o Pensionu Baranekhof v Kaprunu.' },
                  { text: '🇩🇪 Fráze na chatě', q: 'Napiš mi užitečné německé fráze pro objednání jídla na horské chatě v Rakousku a jejich výslovnost.' }
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(undefined, s.q)}
                    className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium px-3 py-1.5 rounded-full border border-slate-200 shrink-0 transition-colors cursor-pointer"
                  >
                    {s.text}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Zeptejte se na počasí, trasy, tipy na jídlo..."
                  className="flex-1 text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-all"
                  disabled={isAiLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isAiLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Persistent Emergency Quick Reference / Help */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-sm space-y-3 shrink-0" id="emergency_ref">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" /> Nouzové kontakty & Rychlý tahák
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-slate-400 block mb-1">Horská služba Rakousko:</span>
              <span className="text-sm font-bold text-white block">📞 140</span>
              <span className="text-[10px] text-slate-400">Evropská pohotovost: 112</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-slate-400 block mb-1">Sídlo ubytování:</span>
              <span className="text-sm font-bold text-white block">Pension Baranekhof</span>
              <span className="text-[10px] text-slate-400">Spatlahnerweg 13, Kaprun</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-slate-400 block mb-1">Místní lékárna:</span>
              <span className="text-sm font-bold text-white block">Apotheke Kaprun</span>
              <span className="text-[10px] text-slate-400">Sigmund-Thun-Straße 22</span>
            </div>
          </div>
        </div>
      </main>

      {/* Humble craft footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 shrink-0" id="footer">
        Aktivní Dovolená Kaprun &bull; 4.7.2026 - 10.7.2026 &bull; Pension Baranekhof &bull; Vyrobeno s láskou k horám 🏔️
      </footer>
    </div>
  );
}
