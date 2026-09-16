/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gigsave-cream': '#FAF7F2',
        'gigsave-navy': '#071A3D',
        'gigsave-gold': '#F5B700',
        'gigsave-gold-hover': '#E0A700',
        'gigsave-[#10B981]': '#10B981',
        'gigsave-red': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gigsave-card': '0 10px 25px rgba(0, 0, 0, 0.06)',
        'gigsave-glow': '0 0 25px rgba(245, 183, 0, 0.35)',
        'sos-glow': '0 8px 25px rgba(239, 68, 68, 0.35)',
      }
    },
  },
  plugins: [],
}

