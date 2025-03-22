import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      height: {
        page: 'calc(100vh - 150px)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '8rem',
        },
      },
    },
  },

  plugins: [
    heroui({
      defaultTheme: 'dark',
      defaultExtendTheme: 'dark',
    }),
  ],
}
