/**
 * Anki Card Template Build Script with Tailwind CSS & PostCSS
 * Combines HTML templates with compiled CSS and inlined JS into distributable files
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const COMMON_DIR = path.join(SRC_DIR, 'common');
const CARD_TYPES_DIR = path.join(SRC_DIR, 'card_types');
const TAILWIND_CONFIG = path.join(ROOT_DIR, 'tailwind.config.js');

// Card type to output folder mapping
const CARD_TYPE_MAP = {
  word: '01_word',
  listening: '02_listening',
  recall: '03_recall',
};

/**
 * Read file content safely
 */
function readFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
  } catch (err) {
    console.warn(`Warning: Could not read ${filePath}`);
  }
  return '';
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Compile CSS using Tailwind CSS and PostCSS
 */
async function compileCSS(rawCSS, sourceFile, cardDir) {
  try {
    const baseConfig = require(TAILWIND_CONFIG);
    const result = await postcss([
      tailwindcss({
        ...baseConfig,
        content: [
          path.join(cardDir, '**/*.{html,js}'),
          path.join(COMMON_DIR, '**/*.{html,js}')
        ]
      }),
      autoprefixer,
    ]).process(rawCSS, { from: sourceFile });
    return result.css;
  } catch (err) {
    console.error(`Error compiling CSS: ${err.message}`);
    return rawCSS;
  }
}

/**
 * Build a single card type
 */
async function buildCardType(cardType) {
  const cardDir = path.join(CARD_TYPES_DIR, cardType);
  const outputDir = path.join(DIST_DIR, CARD_TYPE_MAP[cardType] || cardType);

  if (!fs.existsSync(cardDir)) {
    console.error(`Error: Card type "${cardType}" not found at ${cardDir}`);
    return false;
  }

  console.log(`\n📦 Building card type: ${cardType}`);
  console.log(`   Source: ${cardDir}`);
  console.log(`   Output: ${outputDir}`);

  // Read common files
  const commonCSS = readFile(path.join(COMMON_DIR, 'style.css'));
  const utilsJS = readFile(path.join(COMMON_DIR, 'utils.js'));

  // Read card-specific files
  const cardCSS = readFile(path.join(cardDir, 'style.css'));
  const frontHTML = readFile(path.join(cardDir, 'front.html'));
  const backHTML = readFile(path.join(cardDir, 'back.html'));
  const frontJS = readFile(path.join(cardDir, 'front.js'));
  const backJS = readFile(path.join(cardDir, 'back.js'));

  // Combine CSS & compile through Tailwind/PostCSS
  const combinedRawCSS = `${commonCSS}\n\n/* ===== CARD-SPECIFIC STYLES ===== */\n${cardCSS}`;
  const compiledCSS = await compileCSS(combinedRawCSS, path.join(cardDir, 'style.css'), cardDir);

  // Build front.html with inline JS
  let frontOutput = frontHTML;
  if (frontJS.trim() || utilsJS.trim()) {
    frontOutput += `\n\n<script>\n// === Utils ===\n${utilsJS}\n\n// === Front Logic ===\n${frontJS}\n</script>`;
  }

  // Build back.html with inline JS
  let backOutput = backHTML;
  if (backJS.trim() || utilsJS.trim()) {
    backOutput += `\n\n<script>\n// === Utils ===\n${utilsJS}\n\n// === Back Logic ===\n${backJS}\n</script>`;
  }

  // Ensure output directory exists
  ensureDir(outputDir);

  // Write output files
  fs.writeFileSync(path.join(outputDir, 'style.css'), compiledCSS);
  fs.writeFileSync(path.join(outputDir, 'front.html'), frontOutput);
  fs.writeFileSync(path.join(outputDir, 'back.html'), backOutput);

  console.log(`   ✅ Generated: style.css (${Math.round(Buffer.byteLength(compiledCSS) / 1024 * 10) / 10} KB), front.html, back.html`);
  return true;
}

/**
 * Build all card types
 */
async function buildAll() {
  console.log('🚀 Building all card types...\n');

  const cardTypes = fs.readdirSync(CARD_TYPES_DIR).filter((item) => {
    return fs.statSync(path.join(CARD_TYPES_DIR, item)).isDirectory();
  });

  let successCount = 0;
  for (const cardType of cardTypes) {
    if (await buildCardType(cardType)) {
      successCount++;
    }
  }

  console.log(`\n✨ Build complete! ${successCount}/${cardTypes.length} card types built.`);
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--all') || args.length === 0) {
    await buildAll();
  } else {
    for (const cardType of args) {
      if (cardType.startsWith('--')) continue;
      await buildCardType(cardType);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { buildCardType, buildAll };
