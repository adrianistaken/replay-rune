/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark background colors
        dark: {
          bg: "#12181F", // Very dark gray background
          panel: "#1E2833", // Slightly lighter panels
          card: "#2A3744", // Card backgrounds
        },
        // Text colors
        text: {
          primary: "#EAEAEA", // Main text - light gray
          secondary: "#9FA6AD", // Secondary text - medium gray
          muted: "#6B7280", // Muted text
        },
        // Accent colors
        accent: {
          primary: "#4DA6FF", // Primary accent blue
          success: "#2ECCB0", // Teal/green for success
          warning: "#FFB84D", // Amber for warnings
          error: "#E5534B", // Muted red for errors
        },
        // Chart colors
        chart: {
          blue: "#4DA6FF",
          teal: "#2ECCB0",
          red: "#E5534B",
          green: "#2ECCB0",
          amber: "#FFB84D",
        },
        // Team colors (keeping Dota 2 theme)
        team: {
          radiant: "#2ECCB0", // Using teal for Radiant
          dire: "#E5534B", // Using muted red for Dire
        },
      },
      backgroundColor: {
        "dark-bg": "#12181F",
        "dark-panel": "#1E2833",
        "dark-card": "#2A3744",
      },
      textColor: {
        "text-primary": "#EAEAEA",
        "text-secondary": "#9FA6AD",
        "text-muted": "#6B7280",
      },
      borderColor: {
        "dark-border": "#374151",
        "dark-border-light": "#4B5563",
      },
    },
  },
  plugins: [],
};
