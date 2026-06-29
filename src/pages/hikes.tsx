import { Clock, Compass, Mountain } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import React from 'react';

import { LinkButton } from '@/components/LinkButton';
import { destinations } from '@/lib/destinations';

const HIKES_DATA = [
  {
    title: 'Okruh Zell am See – Bruck údolím',
    image: '/images/route_1.webp',
    points: [
      'Trasa údolím řeky Salzach a podél jižního břehu jezera Zell am See.',
      'Start a cíl v Brucku an der Großglocknerstraße.',
    ],
    distance: '11 km',
    time: '2:48 hod',
    elevation: '+14 m',
    mapUrl:
      'https://mapy.com/cs/turisticka?planovani-trasy&rc=9dVMaxKKxS575adY-fxKNO2dtKeP5&rs=osm&rs=pubt&rs=osm&rs=osm&ri=150040160&ri=28043547&ri=1040825275&ri=1063743585&mrp=%7B%22c%22%3A132%2C%22dt%22%3A%22%22%2C%22d%22%3Atrue%7D&xc=%5B%5D&x=12.8004831&y=47.3276843&z=14',
    locationIds: ['zell_am_see'],
  },
  {
    title: 'Okruh přes soutěsku, Klammsee a na Maiskogel',
    image: '/images/route_2.webp',
    points: [
      'Start přímo od pensionu v Kaprunu.',
      'Průchod divokou soutěskou Sigmund-Thun-Klamm a kolem jezera Klammsee.',
      'Výstup na panorama hory Maiskogel s výhledy na třítisícovky.',
      'Sestup pěšky nebo sjezd lanovkou dolů.',
    ],
    distance: '13,9 km',
    time: '4:31 hod',
    elevation: '+395 m',
    mapUrl:
      'https://mapy.com/cs/turisticka?planovani-trasy&rc=9dKi3xJmA0hNLmZoOVSLgos59T57.hclfGidvs3ffeg4VHf6VEpfVzfRd3r9ezQcsh&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&rs=coor&rs=coor&rs=osm&ri=1072899509&ri=12020854&ri=1107825757&ri=6715739&ri=6156123&ri=1049234303&ri=1118849373&ri=1049369690&ri=&ri=&ri=1270567980&mrp=%7B%22c%22%3A132%2C%22dt%22%3A%22%22%2C%22d%22%3Atrue%7D&xc=%5B%5D&x=12.7381533&y=47.2539451&z=15',
    locationIds: ['sigmund_thun_klam', 'maiskogel'],
  },
  {
    title: 'Výhledová stezka nad Piesendorfem',
    image: '/images/route_3.webp',
    points: [
      'Severní prosluněné stráně nad údolím mezi Kaprunem a Piesendorfem.',
      'Panoramatické výhledy na ledovec Kitzsteinhorn a Vysoké Taury.',
      'Středně náročná trasa s příjemným sklonem.',
    ],
    distance: '16 km',
    time: '6:52 hod',
    elevation: '+1 059 m',
    mapUrl:
      'https://mapy.com/cs/turisticka?planovani-trasy&rc=9dRWPxKMEXaUQgsBiLAkZShxo3BVhIDdiH&rs=osm&rs=osm&rs=osm&rs=osm&rs=osm&ri=1031805746&ri=13075246&ri=6474142&ri=1104832415&ri=10590958&mrp=%7B%22c%22%3A132%2C%22dt%22%3A%22%22%2C%22d%22%3Atrue%7D&xc=%5B%5D&x=12.7690241&y=47.3312090&z=14',
    locationIds: ['schmittenhohe', 'kitzsteinhorn'],
  },
];

interface HikeCardProps {
  title: string;
  image: string;
  points: string[];
  distance: string;
  time: string;
  elevation: string;
  mapUrl: string;
  locationIds?: string[];
}

function HikeCard({
  title,
  image,
  points,
  distance,
  time,
  elevation,
  mapUrl,
  locationIds,
}: HikeCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md md:flex-row">
      <div className="relative h-64 w-full shrink-0 md:h-auto md:w-64">
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full transition-opacity"
        >
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </a>
        <LinkButton
          variant="mapycz"
          href={mapUrl}
          type="icon"
          className="absolute top-3 right-3 z-10"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center p-5">
        <div>
          <h4 className="font-display mb-2 text-lg font-bold text-slate-900">{title}</h4>
          <ul className="mb-4 list-disc space-y-1 pl-4 text-sm leading-relaxed text-slate-600">
            {points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
            <div className="flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-slate-400" />
              <span>
                Délka: <strong className="font-semibold text-slate-900">{distance}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>
                Čas: <strong className="font-semibold text-slate-900">{time}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mountain className="h-4 w-4 text-slate-400" />
              <span>
                Převýšení: <strong className="font-semibold text-slate-900">{elevation}</strong>
              </span>
            </div>
          </div>

          {locationIds && locationIds.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 pt-3">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Lokace na trase
              </span>
              <div className="flex flex-col gap-2">
                {locationIds.map((locId) => {
                  const dest = destinations.find((d) => d.id === locId);
                  if (!dest) return null;
                  return (
                    <Link
                      key={locId}
                      href={`/destination/${locId}`}
                      className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 p-1.5 pr-3 text-slate-700 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-900"
                    >
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        className="h-10 w-10 shrink-0 rounded-md object-cover transition-transform"
                      />
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-sm leading-tight font-semibold">{dest.name}</span>
                        {dest.subtitle && (
                          <span className="text-xs leading-tight font-normal text-slate-500">
                            {dest.subtitle}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Hikes() {
  return (
    <>
      {/* Main Responsive Area */}
      <main
        className="overflow-y-none mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-2 pb-10"
        id="main_content"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          <div className="space-y-4">
            {HIKES_DATA.map((hike, idx) => (
              <HikeCard
                key={idx}
                {...hike}
              />
            ))}
          </div>
        </motion.div>
      </main>
    </>
  );
}
