import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.angy.app',
  appName: 'Angy',
  webDir: 'build',
  server: {
    androidScheme: 'file',
    allowNavigation: ['*'], // Permite que o WebView acesse os arquivos corretamente
    cleartext: true
  }
};

export default config;
