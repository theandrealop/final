import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "pp-mori": ["PP Mori", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fly: "flyAround 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray.800'),
            '--tw-prose-headings': theme('colors.dark-green', '#1a2e22'),
            '--tw-prose-links': theme('colors.blue.700'),
            '--tw-prose-bold': theme('colors.gray.900'),
            '--tw-prose-counters': theme('colors.gray.600'),
            '--tw-prose-bullets': theme('colors.gray.400'),
            '--tw-prose-hr': theme('colors.gray.200'),
            '--tw-prose-quotes': theme('colors.gray.900'),
            '--tw-prose-quote-borders': theme('colors.gray.200'),
            '--tw-prose-captions': theme('colors.gray.500'),
            '--tw-prose-code': theme('colors.pink.600'),
            '--tw-prose-pre-code': theme('colors.gray.100'),
            '--tw-prose-pre-bg': theme('colors.gray.900'),
            '--tw-prose-th-borders': theme('colors.gray.300'),
            '--tw-prose-td-borders': theme('colors.gray.200'),
            fontFamily: 'PP Mori, Inter, system-ui, sans-serif',
            h1: {
              fontFamily: 'PP Mori, Inter, system-ui, sans-serif',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: '#1a2e22',
            },
            h2: {
              fontFamily: 'PP Mori, Inter, system-ui, sans-serif',
              fontWeight: '700',
              color: '#1a2e22',
            },
            h3: {
              fontFamily: 'PP Mori, Inter, system-ui, sans-serif',
              fontWeight: '700',
              color: '#1a2e22',
            },
            table: {
              fontSize: '1rem',
              borderCollapse: 'collapse',
            },
            th: {
              backgroundColor: '#f3f4f6',
              fontWeight: '700',
              padding: '0.75em 1em',
              border: '1px solid #e5e7eb',
            },
            td: {
              padding: '0.75em 1em',
              border: '1px solid #e5e7eb',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
