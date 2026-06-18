import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#c9a84c',
        'gold-light': '#f5ecd7',
        lavender: '#d6cef0',
        sky: '#cce8f4',
        'app-bg': '#fafaf8',
        'app-text': '#3a3630',
        'app-text-sub': '#7a7570',
        'app-border': '#e8e2d8',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
