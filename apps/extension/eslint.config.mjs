import baseConfig from '@internal/eslint-config/base';

/** @type {import('eslint').Linter.Config[]} */
const config = [...baseConfig, { ignores: ['dist/**'] }];

export default config;
