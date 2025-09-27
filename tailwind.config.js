/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './App.tsx',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // 1. All your colors are now defined directly
      colors: {
        border: '#e4e4e7',
        input: '#e4e4e7',
        ring: '#2563eb',
        background: '#ffffff',
        foreground: '#09090b',
        primary: {
          DEFAULT: '#09090b',
          foreground: '#ffffff',
          color: '#2563eb',
          color_foreground: '#eff6ff'
        },
        secondary: {
          DEFAULT: '#f4f4f5',
          foreground: '#18181b',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f4f4f5',
          foreground: '#71717a',
        },
        accent: {
          DEFAULT: '#f4f4f5',
          foreground: '#18181b',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#09090b',
        },
        vision: {
          DEFAULT: '#f5f3ff',
          foreground: '#7c3aed',
        },
        chaos: {
          DEFAULT: '#fdf2f8',
          foreground: '#db2777',
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 4px)",
        sm: "calc(0.75rem - 6px)",
      },
      // 2. Your custom gradients are now available as background utilities
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #db2777 0%, #9333ea 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #fdfdfd 100%)',
        'gradient-disabled': '#e4e4e7',
      },
      // 3. Your custom shadows are now available as shadow utilities
      boxShadow: {
        soft: '0 4px 15px rgba(0, 0, 0, 0.05)',
        medium: '0 6px 25px rgba(0, 0, 0, 0.07)',
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}