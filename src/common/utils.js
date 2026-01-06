/**
 * Anki Card Utilities
 */

/**
 * Highlight a word within text (case-insensitive)
 */
function highlightWord(text, word) {
  if (!text || !word) return text;
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedWord})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

/**
 * Apply highlight to example sentence element
 */
function applyHighlight(exampleSelector, word) {
  const exampleEl = document.querySelector(exampleSelector);
  if (exampleEl && word) {
    exampleEl.innerHTML = highlightWord(exampleEl.textContent, word.trim());
  }
}

/**
 * Normalize and apply color to PartOfSpeech element
 * Converts all formats to: Noun, Verb, Adj, Adv, etc.
 * For nouns: adds [U] or [C] if countable/uncountable specified
 */
function applyPosColor() {
  const posElements = document.querySelectorAll('.pos');
  
  // Map to normalize POS
  const posNormalize = {
    // Noun variations
    'noun': { display: 'Noun', css: 'pos-noun' },
    'n': { display: 'Noun', css: 'pos-noun' },
    'n.': { display: 'Noun', css: 'pos-noun' },
    // Countable noun
    'noun [c]': { display: 'Noun [C]', css: 'pos-noun' },
    'n [c]': { display: 'Noun [C]', css: 'pos-noun' },
    'n. [c]': { display: 'Noun [C]', css: 'pos-noun' },
    'countable': { display: 'Noun [C]', css: 'pos-noun' },
    'c': { display: 'Noun [C]', css: 'pos-noun' },
    // Uncountable noun
    'noun [u]': { display: 'Noun [U]', css: 'pos-noun' },
    'n [u]': { display: 'Noun [U]', css: 'pos-noun' },
    'n. [u]': { display: 'Noun [U]', css: 'pos-noun' },
    'uncountable': { display: 'Noun [U]', css: 'pos-noun' },
    'u': { display: 'Noun [U]', css: 'pos-noun' },
    // Verb
    'verb': { display: 'Verb', css: 'pos-verb' },
    'v': { display: 'Verb', css: 'pos-verb' },
    'v.': { display: 'Verb', css: 'pos-verb' },
    // Adjective
    'adjective': { display: 'Adj', css: 'pos-adj' },
    'adj': { display: 'Adj', css: 'pos-adj' },
    'adj.': { display: 'Adj', css: 'pos-adj' },
    // Adverb
    'adverb': { display: 'Adv', css: 'pos-adv' },
    'adv': { display: 'Adv', css: 'pos-adv' },
    'adv.': { display: 'Adv', css: 'pos-adv' },
    // Preposition
    'preposition': { display: 'Prep', css: 'pos-prep' },
    'prep': { display: 'Prep', css: 'pos-prep' },
    'prep.': { display: 'Prep', css: 'pos-prep' },
    // Conjunction
    'conjunction': { display: 'Conj', css: 'pos-conj' },
    'conj': { display: 'Conj', css: 'pos-conj' },
    'conj.': { display: 'Conj', css: 'pos-conj' },
    // Pronoun
    'pronoun': { display: 'Pron', css: 'pos-pron' },
    'pron': { display: 'Pron', css: 'pos-pron' },
    'pron.': { display: 'Pron', css: 'pos-pron' }
  };
  
  posElements.forEach(function(el) {
    const pos = el.textContent.toLowerCase().trim();
    const normalized = posNormalize[pos];
    if (normalized) {
      el.textContent = normalized.display;
      el.classList.add(normalized.css);
    }
  });
}

/**
 * Get the text content of a hidden field element
 */
function getFieldValue(selector) {
  const el = document.querySelector(selector);
  return el ? el.textContent.trim() : '';
}

/**
 * Initialize card when DOM is ready
 */
function onCardReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}
