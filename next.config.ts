import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const nextConfig = (phase: string): NextConfig => {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next-build',
    output: 'export',
    productionBrowserSourceMaps: true,
    images: {
      unoptimized: true,
    },
    experimental: {
      scrollRestoration: true,
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
      config.experiments.topLevelAwait = true;
      return config;
    },
  };
};

export default nextConfig;
