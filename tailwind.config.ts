/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import daisy from "daisyui";

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
export const plugins = [typography, daisy];
export const daisyui = {
  themes: [
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
    "sunset",
    {
      geist: {
        ...require("daisyui/src/theming/themes")["black"],
        primary: "#ffffff",
        "primary-content": "#000000",
        secondary: "#10233d",
        "secondary-content": "#3e80c6",
        accent: "#2e1938",
        "accent-content": "#bf7af0",
        info: "#0f1c2e",
        "info-content": "#4894e3",
        success: "#1a9338",
        "success-content": "#e5fbea",
        warning: "#291800",
        "warning-content": "#f2a20d",
        error: "#2a1314",
        "error-content": "#e5484d",
        neutral: "#242424",
        "neutral-content": "#a1a1a1",
        "base-100": "#0a0a0a",
        "base-200": "#0f0f0f",
        "base-300": "#000000",
        "base-content": "#ededed",
        "--rounded-box": "1em",
        "--rounded-btn": "0.5rem",
        "--rounded-badge": "0.5rem",
      },
    },
  ],
  base: true,
  styled: true,
  utils: true,
  rtl: false,
  prefix: "",
  logs: true,
};
