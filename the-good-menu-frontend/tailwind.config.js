/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aboitiz: {
          // Core Brand Colors (from the extracted palette)
          primary: '#787160',      // Muted olive/brown (Aboitiz dark text/accents)
          secondary: '#B2BDA2',    // Sage green (The 'Foods' infinity loop color)
          
          // Backgrounds & Text
          bgLight: '#DDE4DD',      // Very light grayish-green for app backgrounds
          textDark: '#303638',     // Charcoal/slate for primary reading text
          
          // Warm Accents
          earth: '#553627',        // Dark brown
          sand: '#CDAA7F',         // Tan/sand
          
          // Functional UI Colors (blended to fit the earthy theme)
          success: '#819b70',      // Deeper green for success alerts
          danger: '#9f4949',       // Muted red for destructive actions/errors
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}