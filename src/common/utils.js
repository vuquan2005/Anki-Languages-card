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
function applyHighlight(exampleSelector, word, rootEl) {
    const root = rootEl || document;
    const exampleEl = root.querySelector(exampleSelector);
    if (exampleEl && word) {
        exampleEl.innerHTML = highlightWord(exampleEl.textContent, word.trim());
    }
}

/**
 * Normalize and apply color to PartOfSpeech element
 * Uses regex patterns to match POS variations with flexible whitespace handling
 */
function applyPosColor(rootEl) {
    const root = rootEl || document;
    const el = root.querySelector('.pos');
    if (!el) return;

    const pos = el.textContent.trim();

    // POS patterns: [regex, display, cssClass]
    // ^$ ensures exact match, \s* in middle allows flexible spacing
    const posPatterns = [
        // Countable noun: noun [c], n[c], countable, c
        [/^(?:(?:noun|n\.?)\s*\[c\]|countable|c)$/i, 'Noun [C]', 'pos-noun'],
        // Uncountable noun: noun [u], n[u], uncountable, u
        [/^(?:(?:noun|n\.?)\s*\[u\]|uncountable|u)$/i, 'Noun [U]', 'pos-noun'],
        // Basic noun: noun, n, n.
        [/^(?:noun|n\.?)$/i, 'Noun', 'pos-noun'],
        // Verb: verb, v, v.
        [/^(?:verb|v\.?)$/i, 'Verb', 'pos-verb'],
        // Adjective: adjective, adj, adj.
        [/^(?:adjective|adj\.?)$/i, 'Adj', 'pos-adj'],
        // Adverb: adverb, adv, adv.
        [/^(?:adverb|adv\.?)$/i, 'Adv', 'pos-adv'],
        // Preposition: preposition, prep, prep.
        [/^(?:preposition|prep\.?)$/i, 'Prep', 'pos-prep'],
        // Conjunction: conjunction, conj, conj.
        [/^(?:conjunction|conj\.?)$/i, 'Conj', 'pos-conj'],
        // Pronoun: pronoun, pron, pron.
        [/^(?:pronoun|pron\.?)$/i, 'Pron', 'pos-pron']
    ];

    for (var i = 0; i < posPatterns.length; i++) {
        if (posPatterns[i][0].test(pos)) {
            el.textContent = posPatterns[i][1];
            el.classList.add(posPatterns[i][2]);
            break;
        }
    }
}

/**
 * Get the text content of a hidden field element
 */
function getFieldValue(selector, rootEl) {
    const root = rootEl || document;
    const el = root.querySelector(selector);
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

/**
 * Normalize IPA by removing extra leading/trailing slashes
 * User input: "/həˈloʊ/" or "həˈloʊ" or "//həˈloʊ//" → display: "/həˈloʊ/"
 */
function normalizeIPA(selector, rootEl) {
    const root = rootEl || document;
    var el = root.querySelector(selector);
    if (!el) return;

    var text = el.textContent.trim();
    // Remove all leading and trailing slashes
    var ipa = text.replace(/^\/+|\/+$/g, '');
    // Only update if there's content
    if (ipa) {
        el.textContent = '/' + ipa + '/';
    }
}

// Bind to window if in browser environment
if (typeof window !== 'undefined') {
    window.highlightWord = highlightWord;
    window.applyHighlight = applyHighlight;
    window.applyPosColor = applyPosColor;
    window.getFieldValue = getFieldValue;
    window.onCardReady = onCardReady;
    window.normalizeIPA = normalizeIPA;
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        highlightWord,
        applyHighlight,
        applyPosColor,
        getFieldValue,
        onCardReady,
        normalizeIPA
    };
}
