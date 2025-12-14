/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        accent: 'hsl(var(--accent))',
        neutral: {
          DEFAULT: 'hsl(var(--neutral))',
          light: 'hsl(var(--neutral-light))',
          dark: 'hsl(var(--neutral-dark))',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}