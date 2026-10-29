// Shared theme of the four service landing pages
module.exports = {
  content: [
    './diseno-web-santo-domingo/index.html',
    './posicionamiento-google-maps/index.html',
    './automatizacion-whatsapp-ia/index.html',
    './crm-a-medida/index.html',
    './casos-de-exito/**/*.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          void: '#0b0f17',
          card: '#0f131c',
          elevated: '#161b26',
          cyan: '#00d2ff',
          emerald: '#10b981',
          border: 'rgba(0, 210, 255, 0.12)'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      }
    }
  }
};
