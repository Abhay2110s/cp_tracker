export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Now you can use bg-main, text-main in your components
        main: 'var(--text-color)',
        bg: 'var(--bg-color)',
        card: 'var(--card-bg)',
        border: 'var(--border-color)',
      }
    },
  },
  plugins: [],
}