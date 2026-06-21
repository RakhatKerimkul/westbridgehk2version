import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.779947119b6c4303a89c57d5722f55c8',
  appName: 'pulse-robot-template-14279',
  webDir: 'dist',
  server: {
    url: 'https://77994711-9b6c-4303-a89c-57d5722f55c8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;