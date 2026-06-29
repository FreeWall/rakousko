import React from 'react';
import { Compass, Clock, Mountain, Award, Navigation, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hikes() {
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

          {/* Points of Interest */}
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
      </main>
    </>
  );
}
