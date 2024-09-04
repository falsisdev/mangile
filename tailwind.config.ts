/** @type {import('tailwindcss').Config} */
export const content = [
  "./components/**/*.{js,vue,ts}",
  "./layouts/**/*.vue",
  "./pages/**/*.vue",
  "./plugins/**/*.{js,ts}",
  "./app.vue",
  "./error.vue",
];
export const theme = {
  extend: {},
};
export const plugins = [require("@tailwindcss/typography"), require("daisyui")];
export const daisyui = {
  themes: [
    "dark",
    "emerald",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    {
      forest: {
        ...require("daisyui/src/theming/themes")["forest"],
        primary: "#addfad",
        warning: "#ff865b",
        info: "#89e0eb",
        "--rounded-btn": "0.5rem",
        "--rounded-badge": "0.5rem",
      },
    },
    {
      lofi: {
        ...require("daisyui/src/theming/themes")["lofi"],
        "--rounded-box": "1em",
        "--rounded-btn": "0.5rem",
        "--rounded-badge": "0.5rem",
      },
    },
    "pastel",
    "wireframe",
    {
      black: {
        ...require("daisyui/src/theming/themes")["black"],
        primary: "#0d0d0d",
        secondary: "#1a1919",
        accent: "#262626",
        info: "#5fcfdd",
        success: "#69fec3",
        warning: "#ffce69",
        error: "#ff9181",
        "--rounded-box": "1em",
        "--rounded-btn": "0.5rem",
        "--rounded-badge": "0.5rem",
      },
    },
    {
      luxury: {
        ...require("daisyui/src/theming/themes")["luxury"],
        primary: "#dca54c",
        "base-content": "#9fb9d0",
        "--rounded-badge": "0.5rem",
      },
    },
    "dracula",
    {
      autumn: {
        ...require("daisyui/src/theming/themes")["autumn"],
        primary: "#ac3e31",
        warning: "#f1c891",
        "--rounded-badge": "0.5rem",
      },
    },
    {
      business: {
        ...require("daisyui/src/theming/themes")["business"],
        primary: "#89e0eb",
        "--rounded-box": "1em",
        "--rounded-btn": "0.5rem",
        "--rounded-badge": "0.5rem",
      },
    },
    "night",
    {
      coffee: {
        ...require("daisyui/src/theming/themes")["coffee"],
        "base-content": "#c8cbd0",
        "--rounded-badge": "0.5rem",
      },
    },
    "dim",
    {
      nord: {
        ...require("daisyui/src/theming/themes")["nord"],
        primary: "#45aeee",
        info: "#89e0eb",
        "--rounded-btn": "0.5rem",
      },
    },
    "sunset",
  ],
  base: true,
  styled: true,
  utils: true,
  rtl: false,
  prefix: "",
  logs: true,
};
