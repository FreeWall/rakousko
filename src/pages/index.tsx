import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import React from 'react';

import { destinations } from '@/lib/destinations';

export default function Home() {
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
                return (
                  <Link
                    key={dest.id}
                    href={`/destination/${dest.id}`}
                    className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300"
                  >
                    <div className="group relative flex h-32 w-full items-end overflow-hidden p-4 text-left sm:h-48">
                      {dest.imageUrl ? (
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-900" />
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/40 to-black/5 transition-colors duration-300" />

                      {/* Content overlay */}
                      <div className="relative z-10 flex w-full items-center justify-between text-white">
                        <div className="flex flex-col">
                          <h4 className="font-display text-lg leading-snug font-bold text-white drop-shadow-md sm:text-lg">
                            {dest.name}
                          </h4>
                          <p className="text-sm font-medium text-slate-200">{dest.subtitle}</p>
                        </div>

                        <div className="ml-4 shrink-0 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
