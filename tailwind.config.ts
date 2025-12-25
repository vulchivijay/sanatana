
import type { Config } from 'tailwindcss';

interface ExtendedConfig extends Config {
  safelist?: string[];
}

const config: ExtendedConfig = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  safelist: [
    // Transitions
    'transform',
    'transition-transform',
    'hover:scale-105',
    'hover:scale-95',
    'duration-300',
    'ease-in-out',

    // Animations
    'animate-fade-in',
    'animate-fade-out',
    'animate-slide-up',
    'animate-slide-down'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        'custom-yellow': '#fdae50',
        'custom-red': '#fa5952',
        'custom-orange': '#fa5952',
        'custom-violet': '#403e87',
        'custom-blue': '#325492',
        'custom-deep-blue': '#162039',
      },
      transitionProperty: {
        all: 'all',
        colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
        opacity: 'opacity',
        transform: 'transform',
      },
    },
  },
  plugins: [],
};

export default config;