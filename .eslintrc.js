module.exports = {
    extends: 'standard-with-typescript',
    parserOptions: {
      project: './tsconfig.json'
    },
    rules: {
      semi: ['off'],
      '@typescript-eslint/semi': ['error', 'always'],
      '@typescript-eslint/explicit-module-boundary-types': ['error', { allowArgumentsExplicitlyTypedAsAny: true }],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off"
    }
  };
  