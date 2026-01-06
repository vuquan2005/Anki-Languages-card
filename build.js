/**
 * Anki Card Template Build Script
 * Combines HTML templates with CSS and JS into distributable files
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const COMMON_DIR = path.join(SRC_DIR, 'common');
const CARD_TYPES_DIR = path.join(SRC_DIR, 'card_types');

// Card type to output folder mapping
const CARD_TYPE_MAP = {
  word: '01_word',
  listening: '02_listening',
  recall: '03_recall'
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
 * Build a single card type
 */
function buildCardType(cardType) {
  const cardDir = path.join(CARD_TYPES_DIR, cardType);
  const outputDir = path.join(DIST_DIR, CARD_TYPE_MAP[cardType] || cardType);

  // Check if card type exists
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

  // Combine CSS (common + card-specific)
  const combinedCSS = `/* ===== COMMON STYLES ===== */\n${commonCSS}\n\n/* ===== CARD-SPECIFIC STYLES ===== */\n${cardCSS}`;

  // Build front.html with inline JS
  let frontOutput = frontHTML;
  if (frontJS.trim()) {
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
  fs.writeFileSync(path.join(outputDir, 'style.css'), combinedCSS);
  fs.writeFileSync(path.join(outputDir, 'front.html'), frontOutput);
  fs.writeFileSync(path.join(outputDir, 'back.html'), backOutput);

  console.log(`   ✅ Generated: style.css, front.html, back.html`);
  return true;
}

/**
 * Build all card types
 */
function buildAll() {
  console.log('🚀 Building all card types...\n');

  const cardTypes = fs.readdirSync(CARD_TYPES_DIR).filter((item) => {
    return fs.statSync(path.join(CARD_TYPES_DIR, item)).isDirectory();
  });

  let successCount = 0;
  for (const cardType of cardTypes) {
    if (buildCardType(cardType)) {
      successCount++;
    }
  }

  console.log(`\n✨ Build complete! ${successCount}/${cardTypes.length} card types built.`);
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);

  if (args.includes('--all') || args.length === 0) {
    buildAll();
  } else {
    // Build specific card types
    for (const cardType of args) {
      if (cardType.startsWith('--')) continue;
      buildCardType(cardType);
    }
  }
}

main();
