import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  ...tseslint.configs.recommended,
  { files: ["**/*.{ts,tsx}"], plugins: { "react-hooks": reactHooks }, rules: reactHooks.configs.recommended.rules },
];
export default config;
