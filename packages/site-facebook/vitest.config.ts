import config from '@internal/vitest-config/lib';
import { defineConfig, mergeConfig } from 'vitest/config';

// DOM tests need a browser-like environment.
export default mergeConfig(config, defineConfig({ test: { environment: 'jsdom' } }));
