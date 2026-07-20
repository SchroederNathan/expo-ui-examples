#!/usr/bin/env node
// Scaffold a new example: creates src/examples/<slug>/index.tsx and registers
// it in src/examples/registry.ts. Run from the repo root:
//   node .claude/skills/add-example/scaffold.mjs <slug> "<Title>" "<Description>" [sf-symbol]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const [slug, title, description, systemImage = 'star.fill'] = process.argv.slice(2);

if (!slug || !title || !description) {
  console.error(
    'Usage: node .claude/skills/add-example/scaffold.mjs <slug> "<Title>" "<Description>" [sf-symbol]',
  );
  process.exit(1);
}
if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
  console.error(`Slug "${slug}" must be kebab-case (lowercase letters, digits, dashes).`);
  process.exit(1);
}

const root = process.cwd();
const registryPath = path.join(root, 'src/examples/registry.ts');
if (!existsSync(registryPath)) {
  console.error(`Cannot find ${registryPath} — run this from the expo-ui-examples repo root.`);
  process.exit(1);
}

const dir = path.join(root, 'src/examples', slug);
if (existsSync(dir)) {
  console.error(`src/examples/${slug} already exists.`);
  process.exit(1);
}

const pascal = slug
  .split('-')
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join('');
const componentName = `${pascal}Screen`;

const screen = `import { Host } from '@expo/ui';
import { Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

export default function ${componentName}() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={12}>
        <Text modifiers={[font({ textStyle: 'headline' })]}>${title}</Text>
        <Text
          modifiers={[
            font({ textStyle: 'footnote' }),
            foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
          ]}>
          Build the example here.
        </Text>
      </VStack>
    </Host>
  );
}
`;

let registry = readFileSync(registryPath, 'utf8');
if (registry.includes(`slug: '${slug}'`)) {
  console.error(`registry.ts already has an entry for "${slug}".`);
  process.exit(1);
}

const importLine = `import ${componentName} from './${slug}';`;
const lastImport = registry.lastIndexOf("\nimport ");
const lastImportEnd = registry.indexOf('\n', lastImport + 1);
registry = registry.slice(0, lastImportEnd) + `\n${importLine}` + registry.slice(lastImportEnd);

const entry = `  {
    slug: '${slug}',
    title: '${title}',
    description: '${description}',
    systemImage: '${systemImage}',
    screen: ${componentName},
  },
`;
const arrayEnd = registry.lastIndexOf('];');
if (arrayEnd === -1) {
  console.error('Could not find the closing "];" of EXAMPLES in registry.ts.');
  process.exit(1);
}
registry = registry.slice(0, arrayEnd) + entry + registry.slice(arrayEnd);

mkdirSync(dir, { recursive: true });
writeFileSync(path.join(dir, 'index.tsx'), screen);
writeFileSync(registryPath, registry);

console.log(`Created src/examples/${slug}/index.tsx and registered "${title}" in registry.ts.`);
console.log('Next: build the real UI in that folder, then verify with `npx tsc --noEmit`.');
