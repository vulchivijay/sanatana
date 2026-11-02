import React from 'react';
import { createGenerateMetadata } from '@lib/pageUtils';

export const generateMetadata = createGenerateMetadata('library-audit');

type LibEntry = {
  version: string;
  status: 'used' | 'maybe-unused' | 'unused';
  evidence: string[];
};

const AUDIT: { dependencies: Record<string, LibEntry>; devDependencies: Record<string, LibEntry> } = {
  dependencies: {
    next: { version: '^16.1.6', status: 'used', evidence: ['next.config.ts', 'app/**'] },
    react: { version: '^19.2.4', status: 'used', evidence: ['app/**', 'components/**'] },
    'react-dom': { version: '^19.2.4', status: 'used', evidence: ['app/**'] },
    tailwindcss: { version: '^4.2.1', status: 'used', evidence: ['tailwind.config.ts', 'postcss.config.cjs', 'app/**'] },
  },
  devDependencies: {
    '@next/bundle-analyzer': { version: '^16.1.6', status: 'used', evidence: ['next.config.ts'] },
    '@tailwindcss/postcss': { version: '^4.2.1', status: 'used', evidence: ['postcss.config.cjs'] },
    '@types/d3': { version: '^7.4.3', status: 'used', evidence: ['app/components/worldmap/*'] },
    '@types/node': { version: '^25.5.0', status: 'used', evidence: ['tsconfig.json', 'node tooling'] },
    '@types/react': { version: '^19.2.14', status: 'used', evidence: ['typings', 'app/**'] },
    '@types/react-dom': { version: '^19.2.3', status: 'used', evidence: ['typings'] },
    '@typescript-eslint/eslint-plugin': { version: '^8.57.0', status: 'used', evidence: ['eslint.config.mjs'] },
    '@typescript-eslint/parser': { version: '^8.57.0', status: 'used', evidence: ['eslint.config.mjs'] },
    autoprefixer: { version: '^10.4.27', status: 'used', evidence: ['postcss.config.cjs'] },
    cheerio: { version: '^1.0.0-rc.12', status: 'used', evidence: ['scripts/audit-seo.js'] },
    'cross-env': { version: '^7.0.3', status: 'used', evidence: ['package.json scripts'] },
    d3: { version: '^7.9.0', status: 'used', evidence: ['app/components/worldmap/*'] },
    depcheck: { version: '^1.4.7', status: 'used', evidence: ['scripts/scripts.txt (npx depcheck)'] },
    eslint: { version: '^9.0.0', status: 'used', evidence: ['eslint.config.mjs'] },
    'eslint-plugin-import': { version: '^2.32.0', status: 'used', evidence: ['eslint.config.mjs'] },
    'eslint-plugin-react': { version: '^7.37.5', status: 'used', evidence: ['eslint.config.mjs'] },
    'eslint-plugin-react-hooks': { version: '^7.0.1', status: 'used', evidence: ['eslint.config.mjs'] },
    'html-minifier-terser': { version: '^7.2.0', status: 'used', evidence: ['scripts/minify-html.js'] },
    husky: { version: '^8.0.3', status: 'used', evidence: ['package.json (prepare)', '.husky/'] },
    minimist: { version: '^1.2.8', status: 'used', evidence: ['scripts/audit-seo.js'] },
    postcss: { version: '^8.5.8', status: 'used', evidence: ['postcss.config.cjs'] },
    prettier: { version: '^3.8.1', status: 'used', evidence: ['.github docs, editor config suggestions'] },
    'readline-sync': { version: '^1.4.10', status: 'maybe-unused', evidence: [] },
    sass: { version: '^1.98.0', status: 'used', evidence: ['styles.scss', 'scripts/compile-scss.js'] },
    'topojson-client': { version: '^3.1.0', status: 'used', evidence: ['app/components/worldmap/*'] },
    'ts-prune': { version: '^0.10.3', status: 'maybe-unused', evidence: [] },
    typescript: { version: '^5.9.3', status: 'used', evidence: ['tsconfig.json'] },
  },
};

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Library Audit</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Dependencies</h2>
        <ul className="list-disc pl-6">
          {Object.entries(AUDIT.dependencies).map(([name, info]) => (
            <li key={name} className="mb-1">
              <strong>{name}</strong>: {info.version} — <em>{info.status}</em>
              {info.evidence.length > 0 && (
                <div className="text-sm text-slate-600">Evidence: {info.evidence.join(', ')}</div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Dev Dependencies</h2>
        <ul className="list-disc pl-6">
          {Object.entries(AUDIT.devDependencies).map(([name, info]) => (
            <li key={name} className="mb-1">
              <strong>{name}</strong>: {info.version} — <em>{info.status}</em>
              {info.evidence.length > 0 && (
                <div className="text-sm text-slate-600">Evidence: {info.evidence.join(', ')}</div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
