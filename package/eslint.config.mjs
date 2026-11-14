import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
    globalIgnores(["coverage", "dist", "sparql-blockly.min.js"]),
    {
        files: ["**/*.ts"],
        extends: [eslint.configs.recommended, tseslint.configs.recommended],
    },
);
