
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { primary: '#0ea5e9', accent: '#2e7d32' },
      keyframes: {
        fadeInUp: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pop: { '0%': { transform: 'scale(.96)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } }
      },
      animation: {
        fadeInUp: 'fadeInUp 260ms ease-out',
        pop: 'pop 220ms ease-out'
      }
    }
  },
  plugins: []
};
