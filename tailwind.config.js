/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./*.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "regal-blue": "#243c5a",
        "primary-color": "#e53b3b",
      },
    },
  },
  plugins: [],
};
export default config;
