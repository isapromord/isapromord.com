// Same theme as the former inline tailwind.config in index.html
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0a0e17',
        surface: { DEFAULT: '#121824', card: '#161f30', border: '#222f46' },
        cyan: { brand: '#00d2ff', glow: '#00d2ff33' },
        emerald: { brand: '#10b981', glow: '#10b98133' }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 35px -5px rgba(0, 210, 255, 0.35)',
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.35)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')]
};
