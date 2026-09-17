import '../common/style.css';
import '../card_types/word/style.css';
import frontHtmlRaw from '../card_types/word/front.html?raw';
import backHtmlRaw from '../card_types/word/back.html?raw';
import { mockCards } from './mockData.js';
import { renderAnkiTemplate } from './renderAnki.js';

let currentCardIndex = 0;
let isDarkMode = false;
let currentDevice = 'responsive'; // 'responsive' | 'mobile'

function renderCurrentCards() {
  const cardData = mockCards[currentCardIndex];
  if (!cardData) return;

  const frontContainer = document.getElementById('frontCardContainer');
  const backContainer = document.getElementById('backCardContainer');

  // Render HTML with Anki template syntax
  frontContainer.innerHTML = renderAnkiTemplate(frontHtmlRaw, cardData.fields);
  backContainer.innerHTML = renderAnkiTemplate(backHtmlRaw, cardData.fields);

  // Apply Front logic
  if (typeof applyPosColor === 'function') applyPosColor(frontContainer);
  if (typeof normalizeIPA === 'function') normalizeIPA('#ipaFront', frontContainer);
  const frontWord = getFieldValue('#wordValue', frontContainer);
  if (frontWord && typeof applyHighlight === 'function') {
    applyHighlight('#exampleFront', frontWord, frontContainer);
  }

  // Apply Back logic
  if (typeof applyPosColor === 'function') applyPosColor(backContainer);
  if (typeof normalizeIPA === 'function') normalizeIPA('#ipaBack', backContainer);
  const backWord = getFieldValue('#wordValue', backContainer);
  if (backWord && typeof applyHighlight === 'function') {
    applyHighlight('#exampleSentence', backWord, backContainer);
  }

  // Tags badge logic
  const tagsContainer = backContainer.querySelector('#tagsContainer');
  if (tagsContainer) {
    const tagsText = tagsContainer.textContent.trim();
    if (tagsText) {
      const tags = tagsText.split(/\s+/).filter((tag) => tag.length > 0);
      tagsContainer.innerHTML = tags.map((t) => `<span class="tag">${t}</span>`).join('');
    }
  }
}

function setupControls() {
  const selectEl = document.getElementById('cardSelector');
  selectEl.innerHTML = mockCards
    .map((c, i) => `<option value="${i}">${c.name}</option>`)
    .join('');

  selectEl.addEventListener('change', (e) => {
    currentCardIndex = parseInt(e.target.value, 10);
    renderCurrentCards();
  });

  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    const previewArea = document.getElementById('previewArea');
    if (isDarkMode) {
      previewArea.classList.add('nightMode');
      themeToggle.textContent = '☀️ Light Mode';
    } else {
      previewArea.classList.remove('nightMode');
      themeToggle.textContent = '🌙 Dark Mode';
    }
  });

  const deviceButtons = document.querySelectorAll('[data-device]');
  deviceButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      deviceButtons.forEach((b) => b.classList.remove('active-device'));
      btn.classList.add('active-device');
      currentDevice = btn.getAttribute('data-device');
      const previewArea = document.getElementById('previewArea');
      if (currentDevice === 'mobile') {
        previewArea.classList.add('preview-mobile');
      } else {
        previewArea.classList.remove('preview-mobile');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupControls();
  renderCurrentCards();
});
