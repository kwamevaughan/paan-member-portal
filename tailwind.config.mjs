/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "paan-blue": "#172840",
        "paan-orange": "#F2B706",
        "paan-red": "#F25849",
      },
      keyframes: {
        slideDown: {
          from: { transform: "translateY(-100px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(0)", opacity: "1" },
          to: { transform: "translateY(-100px)", opacity: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        slideDown: "slideDown 300ms ease-out",
        slideUp: "slideUp 300ms ease-out",
        fadeIn: "fadeIn 300ms ease-out",
        fadeOut: "fadeOut 300ms ease-out",
      },
    },
  },
  plugins: [],
};
