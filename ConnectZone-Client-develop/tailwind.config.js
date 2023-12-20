/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
    },
    colors: {
      white: '#ffffff',
      primary: '#4F46E5',
      black: '#000000',
      red: '#FF0000',
      hoverColor: '#eeeeee',
      bgColor: '#f0f2f5',
      borderColor: '#e0e2e5',
      textDelete: '#c2c0c4',
      modalColor: 'rgba(25, 25, 25, 0.45)',
      iconColor: 'rgba(0, 0, 0, 0.2)',
      transparent: 'transparent',
    },

    screens: {
      desktop: '1440px',
      laptop: '1024px',
      tablet: '768px',
    },
  },
  plugins: [
    function ({addUtilities}) {
      addUtilities({
        '.overflow-hidden': {overflow: 'hidden'},
      })
    },
  ],
  plugins: [],
}
