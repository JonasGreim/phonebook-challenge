import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(scriptDirectory, '..');
const sourcePath = path.join(rootDirectory, 'src/assets/findcall-mark.svg');
const faviconPath = path.join(rootDirectory, 'public/favicon.svg');

function createFavicon(markSource) {
  const markContent = markSource
    .match(/<svg\b[^>]*>([\s\S]*)<\/svg>\s*$/)?.[1]
    ?.trim();

  if (!markContent) {
    throw new Error('The FindCall mark must contain one SVG root element.');
  }

  return [
    '<!-- Generated from src/assets/findcall-mark.svg. Do not edit manually. -->',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">',
    '  <defs><clipPath id="favicon-bubble"><circle cx="32" cy="32" r="30"/></clipPath></defs>',
    '  <circle cx="32" cy="32" r="30" fill="#FFFFFF"/>',
    '  <g clip-path="url(#favicon-bubble)">',
    markContent
      .split('\n')
      .map((line) => `    ${line}`)
      .join('\n'),
    '  </g>',
    '</svg>',
    '',
  ].join('\n');
}

const markSource = await readFile(sourcePath, 'utf8');
const favicon = createFavicon(markSource);

if (process.argv.includes('--check')) {
  const existingFavicon = await readFile(faviconPath, 'utf8');
  if (existingFavicon !== favicon) {
    throw new Error('public/favicon.svg is not generated from the current FindCall mark.');
  }
  process.stdout.write('public/favicon.svg is up to date.\n');
} else {
  await writeFile(faviconPath, favicon);
  process.stdout.write('Generated public/favicon.svg.\n');
}
