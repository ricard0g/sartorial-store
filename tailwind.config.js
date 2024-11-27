/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './config/*.json',
    './layout/*.json',
    './assets/*.json',
    './sections/*.json',
    './sections/*.liquid',
    './snippets/*.json',
    './templates/*.liquid',
    './templates/*.json',
    './templates/customers/*.liquid',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
