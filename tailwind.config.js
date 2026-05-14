/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        start: {
          ink: '#061323',
          deep: '#270644',
          royal: '#3f136d',
          surface: '#51238c',
          open: '#6b3bb7',
          lemon: '#7fdc24',
          lemonSoft: '#b6ef7d',
          lemonDark: '#26a526',
          sand: '#f2ebd7',
          mist: '#f8f6fb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(39, 6, 68, 0.12)',
      },
    },
  },
  plugins: [],
};
