/**
 * Back Card Logic v2
 */

onCardReady(function() {
  const word = getFieldValue('#wordValue');
  
  // 1. Apply color to PartOfSpeech
  applyPosColor();
  
  // 2. Highlight the word in example sentence
  if (word) {
    applyHighlight('#exampleSentence', word);
  }
  
  // 3. Parse and display tags as individual badges
  const tagsContainer = document.getElementById('tagsContainer');
  if (tagsContainer) {
    const tagsText = tagsContainer.textContent.trim();
    if (tagsText) {
      const tags = tagsText.split(/\s+/).filter(function(tag) {
        return tag.length > 0;
      });
      tagsContainer.innerHTML = tags.map(function(tag) {
        return '<span class="tag">' + tag + '</span>';
      }).join('');
    }
  }
});
