import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#f0f9ff",
					100: "#e0f2fe",
					500: "#0ea5e9",
					600: "#0284c7",
					700: "#0369a1",
				},
				secondary: {
					500: "#8b5cf6",
					600: "#7c3aed",
					700: "#6d28d9",
				},
				accent: {
					500: "#ec4899",
					600: "#db2777",
				},
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [],
};
export default config;
