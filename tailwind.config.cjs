// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple:      '#534AB7',
          'purple-dk': '#3C3489',
          'purple-lt': '#EEEDFE',
          'purple-md': '#AFA9EC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)'  },
        },
      },
    },
  },
  plugins: [],
};