/**
 * Front Card Logic
 */

onCardReady(function() {
  // Apply color to PartOfSpeech
  applyPosColor();
  
  // Highlight word in example on front
  const word = getFieldValue('#wordValue');
  if (word) {
    applyHighlight('#exampleFront', word);
  }
});
