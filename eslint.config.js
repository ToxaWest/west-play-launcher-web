import pluginJs from "@eslint/js";
import pluginReact from "@eslint-react/eslint-plugin";
import {defineConfig, globalIgnores} from "eslint/config";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import reactDom from "eslint-plugin-react-dom";
import pluginReactHooks from "eslint-plugin-react-hooks";
import reactHooksExtra from "eslint-plugin-react-hooks-extra";
import reactNamingConvention from "eslint-plugin-react-naming-convention";
import reactWebApi from "eslint-plugin-react-web-api";
import pluginSimpleSort from "eslint-plugin-simple-import-sort"
import pluginSortKeys from "eslint-plugin-sort-keys";
import globals from "globals";
import tseslint from "typescript-eslint";
const GLOBALS_BROWSER_FIX = Object.assign({}, globals.browser, {
    AudioWorkletGlobalScope: globals.browser['AudioWorkletGlobalScope ']
});

delete GLOBALS_BROWSER_FIX['AudioWorkletGlobalScope '];
export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        languageOptions: {
            globals: {
                ...GLOBALS_BROWSER_FIX,
                ...globals.node,
            },
            parser: tseslint.parser,
            parserOptions: {
                ecmaFeatures: {jsx: true},
                ecmaVersion: "latest",
                project: "./tsconfig.json",
                sourceType: "module", // Important for TypeScript linting
            },
        },
        plugins: {
            "@eslint-react": pluginReact,
            '@eslint-react/dom': reactDom,
            '@eslint-react/hooks-extra': reactHooksExtra,
            '@eslint-react/naming-convention': reactNamingConvention,
            '@eslint-react/web-api': reactWebApi,
            "@typescript-eslint": tseslint.plugin,
            "jsx-a11y": pluginJsxA11y,
            "react-hooks": pluginReactHooks,
            "simple-import-sort": pluginSimpleSort,
            "sort-keys": pluginSortKeys
        },
        rules: {
            ...pluginJs.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...pluginReact.configs.recommended.rules,
            ...pluginReactHooks.configs.recommended.rules,
            ...pluginJsxA11y.configs.recommended.rules,
            // Add or override specific rules here
            "@eslint-react/dom/no-dangerously-set-innerhtml": "off", // Example: Warn about missing dependencies in React hooks
            "@eslint-react/dom/no-missing-iframe-sandbox":"off",
            "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": "off", // Disable default no-unused-vars
            "@typescript-eslint/no-unused-vars": ["warn", {argsIgnorePattern: "^_"}], // Use TS version
            "jsx-a11y/click-events-have-key-events": "off",
            "jsx-a11y/no-noninteractive-element-to-interactive-role": "off",
            "jsx-a11y/tabindex-no-positive": "off",
            "no-unused-vars": "off",
            "react-hooks/exhaustive-deps": "off",
            "simple-import-sort/imports": [
                "error",
                {
                    "groups": [
                        // 1. Side effect imports at the start. For me this is important because I want to import reset.css and global styles at the top of my main file.
                        ["^\\u0000"],
                        // 2. `react` and packages: Things that start with a letter (or digit or underscore), or `@` followed by a letter.
                        ["^react$", "^@?\\w"],
                        // 3. Absolute imports and other imports such as Vue-style `@/foo`.
                        // Anything not matched in another group. (also relative imports starting with "../")
                        ["^@", "^"],
                        // 4. relative imports from same folder "./" (I like to have them grouped together)
                        ["^\\./"],
                        // 5. style module imports always come last, this helps to avoid CSS order issues
                        ["^.+\\.(module.css|module.scss)$"],
                        // 6. media imports
                        ["^.+\\.(gif|png|svg\\?react|jpg)$"],
                        ["^\\.(types)$"],
                    ]
                }
            ],
            "sort-keys": ["error", "asc", {"caseSensitive": true, "minKeys": 2, "natural": false}],
            'sort-keys/sort-keys-fix': 1,
            "sort-vars": ["error", {"ignoreCase": true}]
        },
        settings: {
            react: {
                version: "detect"
            },
        },
    },
    globalIgnores([
        "build/**/*",
        "node_modules/**/*",
        "public/**/*",
        ".idea/**/*",
    ])
    // You can add more configurations for specific file types or directories if needed
]);