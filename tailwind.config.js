/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,js}"],
  theme: {
    extend: {
      colors: {
        // Cores primárias
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Cores bíblicas/temáticas
        bible: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        // Cores Dark Mode (do darkmode.css legado)
        dm: {
          bg: {
            primary: "#121212",
            secondary: "#1e1e1e",
            card: "#252525",
            hover: "#2d2d2d",
          },
          text: {
            primary: "#e0e0e0",
            secondary: "#a0a0a0",
            muted: "#808080",
          },
          border: {
            DEFAULT: "#3a3a3a",
            light: "#444444",
          },
          accent: {
            DEFAULT: "#4dabf7",
            hover: "#339af0",
          },
          success: "#51cf66",
          warning: "#ff922b",
          danger: "#ff6b6b",
          info: "#22b8cf",
          // Cor especial para dias lidos (única!)
          "dia-lido": "#d0681d",
          "dia-lido-hover": "#a55218",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-soft": "bounceSoft 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
