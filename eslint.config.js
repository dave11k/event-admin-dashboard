const { FlatCompat } = require("@eslint/eslintrc");
const path = require("path");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

module.exports = [...compat.extends("next/core-web-vitals", "next/typescript")];
