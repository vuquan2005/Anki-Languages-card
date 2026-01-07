/**
 * Front Card Logic
 */

onCardReady(function() {
  // Apply color to PartOfSpeech
  applyPosColor();
  
  // Normalize IPA (remove extra slashes)
  normalizeIPA('#ipaFront');
  
  // Highlight word in example on front
  var word = getFieldValue('#wordValue');
  if (word) {
    applyHighlight('#exampleFront', word);
  }
});
