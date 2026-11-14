import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
    globalIgnores(["node_modules", "public/app.js"]),
    {
        files: ["**/*.ts"],
        extends: [eslint.configs.recommended, tseslint.configs.recommended],
    },
);
