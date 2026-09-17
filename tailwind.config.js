/** @type {import('tailwindcss').Config} */
module.exports = {
  // Support Anki's .nightMode / .night_mode class on <body> or .card
  darkMode: ['class', ':is(.nightMode, .night_mode)'],
  content: [
    './src/**/*.{html,js}',
    './index.html',
    './scripts/**/*.js'
  ],
  corePlugins: {
    // Disable preflight to avoid messing up Anki native audio buttons & UI
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        accent: {
          primary: '#26A69A',
          hover: '#2bbbad',
          light: 'rgba(38, 166, 154, 0.15)',
        },
        pos: {
          noun: '#1E88E5',
          verb: '#E53935',
          adj: '#FB8C00',
          adv: '#8E24AA',
          prep: '#00ACC1',
          conj: '#43A047',
          pron: '#8D6E63',
        },
      },
      fontFamily: {
        anki: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
