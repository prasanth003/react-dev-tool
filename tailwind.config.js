/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // Only dark mode via class
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        devtools: ["'Fira Code'", "monospace"],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '16px' }],
        sm: ['12px', { lineHeight: '18px' }],
        base: ['13px', { lineHeight: '20px' }],
        lg: ['14px', { lineHeight: '21px' }],
      },
      colors: {
        border: "#3A3F45",
        input: "#2A2F33",
        ring: "#0088FF",
        background: "#212728",
        foreground: "#EDEDED",
        primary: {
          DEFAULT: "#3399FF",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#2A2F33",
          foreground: "#CCCCCC",
        },
        destructive: {
          DEFAULT: "#FF5555",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#2C2F34",
          foreground: "#999999",
        },
        accent: {
          DEFAULT: "#33383D",
          foreground: "#EDEDED",
        },
        popover: {
          DEFAULT: "#212728",
          foreground: "#EDEDED",
        },
        card: {
          DEFAULT: "#2A2F33",
          foreground: "#EDEDED",
        },
      },
      borderRadius: {
        lg: "0.25rem",
        md: "0.25rem",
        sm: "0.125rem",
      },
    },
  },
  plugins: [],
}