#!/usr/bin/env bash
# Verifies the built dist/ output is actually importable the way a real
# consumer would import it — packs the package (npm pack, same as what gets
# published), installs the tarball into a throwaway project, and typechecks
# a real import against it. Catches "exports" map / declaration-output
# regressions that typechecking src/ directly (via tsconfig path mapping)
# never exercises.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERIFY_DIR="$(mktemp -d)"
trap 'rm -rf "$VERIFY_DIR"' EXIT

cd "$ROOT_DIR"
PACK_FILE="$(npm pack --silent --pack-destination "$VERIFY_DIR")"

cd "$VERIFY_DIR"
npm init -y >/dev/null
npm install --no-save typescript @types/react@19 react@19 react-native@0.84.1 "$PACK_FILE" >/dev/null

cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["ES2017"],
    "jsx": "react-native",
    "strict": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["verify.tsx"]
}
EOF

cat > verify.tsx <<'EOF'
import { VajraProvider, Box, Text, Button, useVajraTheme, createVajraTheme } from '@88khp/vajra-ui';

const theme = createVajraTheme({ fonts: {} });

const Inner = () => {
  const { colors } = useVajraTheme();

  return (
    <Box p="s-4" bg="primary">
      <Text color="text">{colors.primary}</Text>
      <Button label="ok" onPress={() => {}} />
    </Box>
  );
};

export const Verify = () => (
  <VajraProvider theme={theme}>
    <Inner />
  </VajraProvider>
);
EOF

npx tsc --noEmit

echo "dist/ verified importable — VajraProvider, Box, Text, Button, useVajraTheme, createVajraTheme all resolve with correct types."
