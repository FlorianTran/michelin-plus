import next from 'eslint-config-next';

/** Flat config — eslint-config-next v16 ships a native flat config array. */
const eslintConfig = [
  ...next,
  {
    // rAF count-up / gauge-fill effects legitimately seed state on mount;
    // the new react-hooks rule over-flags this animation pattern.
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  { ignores: ['.next/**', 'node_modules/**', 'prisma/generated/**', 'next-env.d.ts'] },
];

export default eslintConfig;
