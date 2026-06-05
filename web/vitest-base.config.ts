// Learn more about Vitest configuration options at https://vitest.dev/config/

import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, '**/tests/mocks/**', '**/tests/utils/**'],
    },
  },
});
