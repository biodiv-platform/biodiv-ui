module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "prettier/react"
  ],
  rules: {
    "no-useless-escape": "off",
    "no-case-declarations": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react/jsx-key": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/no-children-prop": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    "no-console": ["error", { allow: ["warn", "error", "debug"] }]
  }
};
