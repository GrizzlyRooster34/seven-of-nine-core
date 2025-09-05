import { defineConfig } from 'tsup'

export default defineConfig([
  // Development build - fast iteration
  {
    name: 'dev',
    entry: {
      'boot-seven': 'boot-seven.ts',
      'seven-runtime': 'seven-runtime/index.ts',
      'memory-engine': 'src/memory/search-adapter.ts',
      'security-middleware': 'seven-runtime/security_middleware.ts',
      'health-monitor': 'src/ops/health-sqlite.ts'
    },
    format: ['cjs'],
    target: 'node18',
    sourcemap: true,
    dts: false,
    clean: false,
    outDir: 'dist/dev',
    minify: false,
    splitting: false,
    treeshake: false
  },
  // Production build - optimized
  {
    name: 'prod',
    entry: {
      'seven-core': 'boot-seven.ts',
      'seven-runtime': 'seven-runtime/index.ts',
      'security-stack': 'seven-runtime/security_middleware.ts',
      'memory-stack': 'src/memory/search-adapter.ts',
      'monitoring': 'src/ops/health-sqlite.ts'
    },
    format: ['cjs'],
    target: 'node18',
    sourcemap: true,
    dts: true,
    clean: true,
    outDir: 'dist/prod',
    minify: true,
    splitting: true,
    treeshake: true,
    bundle: true,
    external: ['better-sqlite3', 'sqlite3']
  }
])