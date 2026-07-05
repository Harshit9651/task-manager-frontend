/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          25: '#fbfbfa',
          50: '#f6f6f4',
          100: '#eeeeea',
          200: '#dedede',
          300: '#c2c2bd',
          400: '#95958d',
          500: '#6f6f66',
          600: '#54544c',
          700: '#3d3d37',
          800: '#282825',
          900: '#181815',
          950: '#0d0d0b',
        },
        brand: {
          50: '#f1f3fb',
          100: '#e2e6f6',
          200: '#c1c9ec',
          300: '#96a3de',
          400: '#6b78cd',
          500: '#4a55b8',
          600: '#383f9c',
          700: '#2d3380',
          800: '#242866',
          900: '#1c2050',
          950: '#12142f',
        },
        accent: {
          50: '#fdf5ec',
          100: '#f9e6cd',
          200: '#f2c98e',
          300: '#eaac59',
          400: '#e08f2e',
          500: '#c8721a',
          600: '#a35a15',
        },
        success: {
          50: '#eefaf3',
          500: '#1a9f6b',
          600: '#158058',
        },
        warning: {
          50: '#fff8ec',
          500: '#dd9b1f',
          600: '#b57a12',
        },
        danger: {
          50: '#fdf0ef',
          500: '#d0483a',
          600: '#ab372b',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(20,20,15,0.04), 0 1px 3px 0 rgba(20,20,15,0.06)',
        card: '0 1px 2px rgba(20,20,15,0.04), 0 8px 24px -8px rgba(20,20,15,0.08)',
        pop: '0 12px 32px -8px rgba(28,32,80,0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease both',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
