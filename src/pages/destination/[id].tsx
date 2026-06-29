import { ArrowLeft, Info, Mountain, PawPrint, QrCode, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';

import { LinkButton } from '@/components/LinkButton';
import { Destination, destinations } from '@/lib/destinations';

interface DestinationDetailProps {
  destination: Destination;
}

export default function DestinationDetail({ destination }: DestinationDetailProps) {
  return (
    <>
      <Head>
        <title>{`${destination.name} | Rakousko 2026`}</title>
        <meta
          name="description"
          content={`${destination.name} - ${destination.subtitle || destination.description}`}
        />
      </Head>

      <main
        className="overflow-y-none mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6"
        id="main_content"
      >
        {/* Dynamic Detail Card with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden bg-white shadow-sm"
        >
          {/* Hero Image Section */}
          <div className="relative h-64 w-full overflow-hidden sm:h-96">
            {destination.imageUrl ? (
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-slate-900" />
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="absolute top-4 left-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-900/70 text-white transition-colors after:absolute after:-inset-8 after:content-[''] hover:bg-slate-900/80 active:scale-95"
              title="Zpět"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            {/* Title & Subtitle inside Hero */}
            <div className="absolute right-0 bottom-0 left-0 p-6 text-white sm:p-8">
              <h1 className="font-display text-xl font-bold text-white drop-shadow-md sm:text-4xl">
                {destination.name}
              </h1>
              {destination.subtitle && (
                <p className="text-sm font-medium text-slate-200 drop-shadow-sm sm:mt-1 sm:text-lg">
                  {destination.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Content Layout */}
          <div className="grid grid-cols-1 gap-5 p-4 sm:p-8 md:grid-cols-12 md:gap-8">
            {/* Left Column: Description & Highlights (7/12) */}
            <div className="space-y-4 md:col-span-7">
              {/* Mobile Navigation & Links (placed right below description for fast mobile access) */}
              {(destination.mapyUrl || destination.webUrl) && (
                <div className="block space-y-2.5">
                  <div className="flex gap-3">
                    {destination.webUrl && (
                      <LinkButton
                        variant="external"
                        href={destination.webUrl}
                        className="w-full text-sm"
                      >
                        Oficiální web
                      </LinkButton>
                    )}
                    {destination.googleMapsUrl && (
                      <LinkButton
                        variant="googlemaps"
                        href={destination.googleMapsUrl}

                        type="icon"
                      >
                        Google Maps
                      </LinkButton>
                    )}
                    {destination.mapyUrl && (
                      <LinkButton
                        variant="mapycz"
                        href={destination.mapyUrl}
                        className=""
                        type="icon"
                      >
                        Mapy.cz
                      </LinkButton>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Info Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {destination.slCardInfo && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-100/60 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                    <QrCode className="h-3.5 w-3.5 text-blue-600" />
                    {destination.groupPriceCard?.includes('0,00') ||
                    destination.slCardInfo.toLowerCase().includes('zdarma')
                      ? 'SL Card: Zdarma'
                      : 'SL Card: Sleva'}
                  </span>
                )}

                {destination.dogInfo && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      destination.dogPrice?.toLowerCase().includes('zakázán')
                        ? 'border-rose-100/60 bg-rose-50 text-rose-800'
                        : 'border-amber-200/40 bg-amber-100/50 text-amber-800'
                    }`}
                  >
                    <PawPrint className="h-3.5 w-3.5 text-amber-600" />
                    {destination.dogPrice?.toLowerCase().includes('zakázán')
                      ? 'Zákaz psů'
                      : 'Psi povoleni'}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm text-slate-700 sm:text-base">{destination.description}</p>
                {destination.highlights && destination.highlights.length > 0 && (
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700 sm:text-base">
                    {destination.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right Column: Tips, SalzburgerLand Card, Cable Car Info, Maps (5/12) */}
            <div className="space-y-4 md:col-span-5">
              {/* Recommendations & Tips */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 text-xs text-emerald-900 sm:text-sm">
                <div className="mb-2 flex items-center gap-2 font-bold text-emerald-800">
                  <Info className="h-4 w-4 shrink-0 text-emerald-600" />
                  Doporučení & Tipy
                </div>
                <p className="">{destination.tips}</p>
              </div>

              {/* Cable car operating details */}
              {(destination.cableCarHours || destination.cableCarDuration) && (
                <div className="rounded-xl border border-slate-200/80 bg-slate-100/50 p-4 text-xs text-slate-700 sm:text-sm">
                  <div className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                    <Mountain className="h-4 w-4 shrink-0 text-emerald-600" />
                    Detaily dopravy / lanovky
                  </div>
                  <div className="space-y-2">
                    {destination.cableCarHours && (
                      <div className="flex justify-between gap-2 border-b border-slate-200/40 pb-2">
                        <span className="font-medium text-slate-500">Provozní doba:</span>
                        <span className="font-semibold text-slate-950">
                          {destination.cableCarHours}
                        </span>
                      </div>
                    )}
                    {destination.cableCarDuration && (
                      <div className="flex justify-between gap-2">
                        <span className="font-medium text-slate-500">Doba jízdy:</span>
                        <span className="font-semibold text-slate-950">
                          {destination.cableCarDuration}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Group Ticket Info */}
              {(destination.groupPriceNormal || destination.groupPriceCard) && (
                <div className="rounded-xl border border-slate-200/80 bg-slate-100/50 p-4 text-xs text-slate-700 sm:text-sm">
                  <div className="mb-3 flex items-start gap-2 border-b border-indigo-100 pb-2.5">
                    <QrCode className="h-4.5 w-4.5 shrink-0 text-blue-600" />
                    <div className="space-y-1">
                      <span className="block font-bold text-slate-800">SalzburgerLand Card</span>
                      <p className="text-slate-600">{destination.slCardInfo}</p>
                    </div>
                  </div>
                  <div className="mb-2.5 flex items-center gap-2 font-bold text-slate-800">
                    <Users className="h-4 w-4 shrink-0 text-blue-600" />
                    Vstupné pro skupinu (4 dospělí)
                  </div>
                  <div className="space-y-2">
                    {destination.groupPriceNormal && (
                      <div className="flex justify-between gap-2 border-b border-slate-100 pb-1.5">
                        <span className="font-medium text-indigo-950/70">Bez karty:</span>
                        <span className="font-semibold text-indigo-950">
                          {destination.groupPriceNormal}
                        </span>
                      </div>
                    )}
                    {destination.groupPriceCard && (
                      <div className="flex justify-between gap-2">
                        <span className="font-medium text-emerald-800">S kartou SL Card:</span>
                        <span className="font-bold text-emerald-700">
                          {destination.groupPriceCard}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Dog Friendliness & Rules Info */}
              {destination.dogInfo && (
                <div className="rounded-xl border border-amber-200 bg-amber-100/50 p-4 text-sm text-amber-900">
                  <div className="mb-2 flex items-center gap-2 font-bold text-amber-800">
                    <PawPrint className="h-4.5 w-4.5 shrink-0 text-amber-600" />
                    Cestování se psem
                  </div>
                  <p className="mb-2.5 text-amber-950/85">{destination.dogInfo}</p>
                  {destination.dogPrice && (
                    <div className="border-t border-amber-200/40 pt-2">
                      <div className="font-medium text-amber-800">Poplatek za psa:</div>
                      <div className="font-bold text-amber-950">{destination.dogPrice}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = destinations.map((dest) => ({
    params: { id: dest.id },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<DestinationDetailProps> = async ({ params }) => {
  const id = params?.id as string;
  const destination = destinations.find((d) => d.id === id);

  if (!destination) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      destination,
    },
  };
};
