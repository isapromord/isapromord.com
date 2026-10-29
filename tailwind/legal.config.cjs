// Shared theme of privacidad/ and terminos/
module.exports = {
  content: ['./privacidad/index.html', './terminos/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        void: '#0b0f17',
        surface: '#0f1422',
        electric: '#00d2ff',
        emeraldCustom: '#10b981'
      }
    }
  }
};
