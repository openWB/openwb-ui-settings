import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    ignores: ["public/modules/legacy_smart_home/", "public/dataProtection-usageTerms.html"],
  },
  {
    files: ["**/*.{vue,js,jsx,cjs,mjs}"],
    ignores: ["public/modules/legacy_smart_home/**", "public/dataProtection-usageTerms.html"],
    languageOptions: {
      ecmaVersion: "latest",
    },
    plugins: {
      prettier,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": [
        "error",
        {
          printWidth: 120,
          singleQuote: false,
          singleAttributePerLine: true,
          trailingComma: "all",
          arrowParens: "always",
        },
      ],
    },
  },
];
