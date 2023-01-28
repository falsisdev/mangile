module.exports = {
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
      styled: true,
      themes: true,
      base: true,
      utils: true,
      logs: true,
      rtl: false,
      prefix: "",
      darkTheme: "night",
    }
}