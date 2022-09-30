module.exports = {
  env: {
    es6: true,
  },
  globals:{
    uni: true
  },
  plugins:[
    "vue",
    "prettier",
  ],
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": 1,
    "@typescript-eslint/no-explicit-any": 1,
    "vue/multi-word-component-names": 1,
    "vue/multi-word-component-names":0
  },
};
