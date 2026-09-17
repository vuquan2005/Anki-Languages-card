/**
 * AnkiConnect Auto-Sync Script
 * Automatically syncs compiled card templates & styles directly into Anki
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ANKICONNECT_URL = process.env.ANKI_CONNECT_URL || 'http://127.0.0.1:8765';

// Mapping card types to dist folders
const CARD_TYPE_MAP = {
  word: '01_word',
  listening: '02_listening',
  recall: '03_recall',
};

// Required fields for the Word card type
const WORD_FIELDS = [
  'Word',
  'IPA',
  'PartOfSpeech',
  'Meaning',
  'ExampleSentence',
  'collocations pattern',
  'image',
  'Audio',
  'Notes',
  'Tags',
];

/**
 * Send request to AnkiConnect API
 */
async function ankiInvoke(action, params = {}) {
  const response = await fetch(ANKICONNECT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, version: 6, params }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
}

/**
 * Determine Note Type to sync into
 */
async function resolveNoteTypeName(preferredName, existingModels) {
  if (preferredName) {
    return preferredName;
  }
  // Check if "Languages" exists (very common user model)
  if (existingModels.includes('Languages')) {
    return 'Languages';
  }
  // Check if "Anki-Languages-Word" exists
  if (existingModels.includes('Anki-Languages-Word')) {
    return 'Anki-Languages-Word';
  }
  // Default to Languages
  return 'Languages';
}

/**
 * Sync templates for a card type
 */
async function syncCardType(cardType = 'word', customModelName = null) {
  const distFolder = path.join(DIST_DIR, CARD_TYPE_MAP[cardType] || cardType);

  if (!fs.existsSync(distFolder)) {
    console.error(`❌ Output folder not found: ${distFolder}`);
    console.error(`   Please run "npm run build" first!`);
    return false;
  }

  const frontPath = path.join(distFolder, 'front.html');
  const backPath = path.join(distFolder, 'back.html');
  const cssPath = path.join(distFolder, 'style.css');

  if (!fs.existsSync(frontPath) || !fs.existsSync(backPath) || !fs.existsSync(cssPath)) {
    console.error(`❌ Missing dist files in ${distFolder}. Run "npm run build" first.`);
    return false;
  }

  const frontHTML = fs.readFileSync(frontPath, 'utf8');
  const backHTML = fs.readFileSync(backPath, 'utf8');
  const stylingCSS = fs.readFileSync(cssPath, 'utf8');

  console.log(`\n🔌 Connecting to AnkiConnect at ${ANKICONNECT_URL}...`);

  let models;
  try {
    models = await ankiInvoke('modelNames');
    console.log(`   ✅ Connected to Anki! Found ${models.length} Note Types.`);
  } catch (err) {
    console.error(`\n❌ Failed to connect to Anki!`);
    console.error(`   Error: ${err.message}`);
    console.error(`   👉 Please make sure:`);
    console.error(`      1. Anki desktop app is running.`);
    console.error(`      2. AnkiConnect addon (code: 2055492159) is installed.`);
    return false;
  }

  const modelName = await resolveNoteTypeName(customModelName || process.env.ANKI_NOTE_TYPE, models);
  console.log(`🎯 Target Note Type: "${modelName}"`);

  if (!models.includes(modelName)) {
    console.log(`   ℹ️  Note Type "${modelName}" does not exist yet. Creating it automatically...`);
    try {
      await ankiInvoke('createModel', {
        modelName,
        inOrderFields: WORD_FIELDS,
        cardTemplates: [
          {
            Name: 'Card 1',
            Front: frontHTML,
            Back: backHTML,
          },
        ],
        css: stylingCSS,
      });
      console.log(`   🎉 Created Note Type "${modelName}" with fields: [${WORD_FIELDS.join(', ')}]`);
      return true;
    } catch (createErr) {
      console.error(`   ❌ Failed to create Note Type: ${createErr.message}`);
      return false;
    }
  }

  // Model exists: check fields
  const fields = await ankiInvoke('modelFieldNames', { modelName });
  console.log(`   📋 Existing fields in "${modelName}": [${fields.join(', ')}]`);

  const missingFields = WORD_FIELDS.filter((f) => !fields.includes(f));
  if (missingFields.length > 0) {
    console.warn(`   ⚠️  Note: Some recommended fields are missing from "${modelName}": [${missingFields.join(', ')}]`);
    console.warn(`      (You can add them in Anki: Manage Note Types -> Fields)`);
  }

  // Fetch templates to find the card name (e.g. "Thẻ 1" or "Card 1")
  const currentTemplates = await ankiInvoke('modelTemplates', { modelName });
  const cardNames = Object.keys(currentTemplates);

  if (cardNames.length === 0) {
    console.error(`   ❌ No card templates found inside "${modelName}".`);
    return false;
  }

  const targetCardName = cardNames[0]; // Update the first card template
  console.log(`   📝 Updating card template: "${targetCardName}"...`);

  await ankiInvoke('updateModelTemplates', {
    model: {
      name: modelName,
      templates: {
        [targetCardName]: {
          Front: frontHTML,
          Back: backHTML,
        },
      },
    },
  });

  console.log(`   🎨 Updating Note Type styling...`);
  await ankiInvoke('updateModelStyling', {
    model: {
      name: modelName,
      css: stylingCSS,
    },
  });

  console.log(`\n✨ Successfully synced to Anki Note Type "${modelName}"!`);
  console.log(`   - Card Template: "${targetCardName}" updated.`);
  console.log(`   - CSS Styling: updated.`);
  console.log(`   - Review your cards in Anki to see changes immediately!`);
  return true;
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const customModel = args[0] && !args[0].startsWith('--') ? args[0] : null;
  const cardType = args[1] && !args[1].startsWith('--') ? args[1] : 'word';

  try {
    const ok = await syncCardType(cardType, customModel);
    if (!ok) process.exit(1);
  } catch (err) {
    console.error(`\n❌ Unexpected error: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { syncCardType };
