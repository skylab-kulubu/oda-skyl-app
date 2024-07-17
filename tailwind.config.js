/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        darkBlue: "#070332",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbarThin": {
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(180 180 180) transparent",
        },
        ".scrollbarWebkit": {
          "&::-webkit-scrollbar": {
            width: "7px",
          },

          "&::-webkit-scrollbar-track": {
            background: "transparent",
            borderRadius: "0.5rem",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgb(255 255 255)",
            borderRadius: "0.5rem",
            opacity: "0.2",
            "&:hover": {
              opacity: "0.3",
            },
          },
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
