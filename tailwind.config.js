/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dispatch: {
          bg: 'rgb(var(--dispatch-bg) / <alpha-value>)',
          panel: 'rgb(var(--dispatch-panel) / <alpha-value>)',
          panel2: 'rgb(var(--dispatch-panel2) / <alpha-value>)',
          line: 'rgb(var(--dispatch-line) / <alpha-value>)',
          text: 'rgb(var(--dispatch-text) / <alpha-value>)',
          dim: 'rgb(var(--dispatch-dim) / <alpha-value>)',
          accent: '#f2a93b',
          accentDim: '#8a6423',
          danger: '#ff5d5d',
          success: '#5ee6a5',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'IBM Plex Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
