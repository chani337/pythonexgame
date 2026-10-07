import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Everything under test is a pure function or a data file. Nothing needs
    // a DOM, and decodeAnswer's atob/TextDecoder are both Node built-ins.
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
