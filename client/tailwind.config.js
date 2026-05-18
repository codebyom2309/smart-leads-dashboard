/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Brand colors
        ink: '#171717',
        canvas: '#ffffff',
        'canvas-soft': '#fafafa',
        'canvas-soft-2': '#f5f5f5',
        hairline: '#ebebeb',
        'hairline-strong': '#a1a1a1',

        // Text
        body: '#4d4d4d',
        mute: '#888888',

        // Semantic
        link: '#0070f3',
        'link-deep': '#0761d1',
        success: '#0070f3',
        error: '#ee0000',
        'error-soft': '#f7d4d6',
        'error-deep': '#c50000',
        warning: '#f5a623',
        'warning-soft': '#ffefcf',

        // Gradient stops
        'grad-blue': '#007cf0',
        'grad-teal': '#00dfd8',
        'grad-violet': '#7928ca',
        'grad-pink': '#ff0080',
        'grad-coral': '#ff4d4d',
        'grad-amber': '#f9cb28',

        // Premium dashboard palette
        primary: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        surface: {
          DEFAULT: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
        },
        dark: {
          bg: '#0a0a0f',
          surface: '#111118',
          border: '#1e1e2e',
          card: '#16161f',
          hover: '#1c1c28',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #007cf0, #00dfd8, #7928ca, #ff0080)',
        'hero-gradient': 'radial-gradient(ellipse at top, #6366f115 0%, transparent 60%), radial-gradient(ellipse at bottom-right, #8b5cf615 0%, transparent 60%)',
        'card-gradient': 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0f, #111118)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
      },
      boxShadow: {
        'card': '0px 1px 1px rgba(0,0,0,0.03), 0px 2px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.08)',
        'card-hover': '0px 2px 4px rgba(0,0,0,0.06), 0px 8px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.08)',
        'modal': '0px 1px 1px rgba(0,0,0,0.03), 0px 8px 16px rgba(0,0,0,0.06), 0px 24px 32px rgba(0,0,0,0.08)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-sm': '0 0 10px rgba(99, 102, 241, 0.2)',
        'dark-card': '0px 1px 1px rgba(0,0,0,0.2), 0px 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)',
        'dark-hover': '0px 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08), 0 0 20px rgba(99,102,241,0.15)',
        'inset': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      letterSpacing: {
        'display-xl': '-0.05em',
        'display-lg': '-0.04em',
        'display-md': '-0.03em',
        'display-sm': '-0.02em',
        'tight-2': '-0.02em',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'count-up': 'countUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(99, 102, 241, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      borderRadius: {
        'pill': '100px',
      },
    },
  },
  plugins: [],
};
