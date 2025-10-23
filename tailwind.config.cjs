/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {},
    },
    plugins: [require("@tailwindcss/typography"),require("daisyui")],
    daisyui: {
        // 1. We list ONLY the themes we want.
        // The first one ("cupcake") becomes the default light theme.
        themes: ["cupcake", "luxury","dracula","emerald","pastal","fantasy"], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]  
        // 2. We explicitly set the default dark theme.
        darkTheme: "dracula", //"dracula"luxury, // name of one of the included themes for dark mode
		logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
    }
}