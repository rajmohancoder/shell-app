/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        shell: {
          bg: '#f8fafc',
          sidebar: '#1e293b',
          header: '#ffffff',
          border: '#e2e8f0',
        },
      },
    },
  },
  plugins: [],
};
