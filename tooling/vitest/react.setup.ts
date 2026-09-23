import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Clean up after each test
afterEach(() => {
  cleanup();
});
