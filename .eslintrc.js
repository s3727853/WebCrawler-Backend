module.exports = {
  root: true,

  parser: 'babel-eslint',

  plugins: ['import'],

  env: {
    browser: true,
    node: true,
    es6: true
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },

  extends: [
    'eslint:recommended',
    'eslint-config-airbnb-base'
  ],

  rules: {
    'comma-dangle': 'off',
    'import/order': 'error'
  }
};
