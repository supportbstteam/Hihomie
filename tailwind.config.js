/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
    theme: { extend: {
    colors: {
        primary: '#3b82f6', // your brand blue
        secondary: '#3b82f6', // your brand blue
        stock: '#e7eaf3',   // light gray border color
      },
  } },
  plugins: [],
}
