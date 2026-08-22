import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			glow: 'hsl(var(--glow))',
  			surface: {
  				'50': 'hsl(var(--surface-50))',
  				'100': 'hsl(var(--surface-100))',
  				'200': 'hsl(var(--surface-200))',
  				'300': 'hsl(var(--surface-300))',
  				'400': 'hsl(var(--surface-400))',
  				'500': 'hsl(var(--surface-500))',
  				'600': 'hsl(var(--surface-600))',
  				'700': 'hsl(var(--surface-700))',
  				'800': 'hsl(var(--surface-800))',
  				'900': 'hsl(var(--surface-900))',
  				'950': 'hsl(var(--surface-950))',
  			},
  		},
  		fontFamily: {
  			sans: ['var(--font-body)'],
  			display: ['var(--font-display)'],
  			mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'fade-up': {
  				from: { opacity: '0', transform: 'translateY(12px)' },
  				to: { opacity: '1', transform: 'translateY(0)' },
  			},
  		},
  		animation: {
  			'fade-up': 'fade-up 0.6s ease-out both',
  		},
  	}
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
