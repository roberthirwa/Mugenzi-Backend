import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.citizen.app',
  appName: 'Mugenzi AI Companion',
  webDir: 'dist',
  server: {
    // Replace with your local machine's local IP address (e.g., 192.168.x.x)
    url: 'http://0.0.0.0:3000', 
    cleartext: true
  }
};

export default config;
