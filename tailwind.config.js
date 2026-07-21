/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // toggle by adding/removing 'dark' class on <html>
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds & surfaces
        bg: {
          DEFAULT: " #FFFFFF  ",
          dark: " #050505",
        },
        surface: {
          DEFAULT: " #ddfcfa",
          dark: " #0F0F12", // derived: slightly lifted off #050505 so cards read as elevated
        },

        // Primary
        primary: {
          DEFAULT: " #0891B2",
          hover: " #0E7490",
          dark: " #06048E",
          "dark-hover": " #1210B3", // derived: lighter than base so hover state is visible on near-black bg
        },

        // Secondary
        secondary: {
          DEFAULT: " #4C5FD5",
          hover: " #3B4BB0",
          tint: " #EEF0FC",
          dark: " #8B93F8",
          "dark-hover": " #A5ACFA",
        },

        // Accent
        accent: {
          DEFAULT: " #9A2FE6",
          hover: " #7E22CE",
          dark: " #6F0A88",
          "dark-hover": " #8A14A6", // derived: lighter for visible hover on dark bg
        },

        // Text
        text: {
          primary: " #1A1A1A",
          secondary: "# 5B6470",
          "primary-dark": " #E6EDF3",
          "secondary-dark": " #8B949E",
        },

        // Borders
        border: {
          DEFAULT: "#E4E7EB",
          dark: "#30363D",
        },

        // Status
        success: { DEFAULT: "#16A34A", dark: "#34D399" },
        warning: { DEFAULT: "#D97706", dark: "#FBBF24" },
        danger: { DEFAULT: "#DC2626", dark: "#F87171" },
      },
      fontFamily: {
        body: ["var(--font-body)", "serif"],
        heading: ["var(--font-heading)", "sans-serif"],
      },
    },
  },
  plugins: [],
};