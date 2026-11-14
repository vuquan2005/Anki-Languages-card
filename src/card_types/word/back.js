/**
 * Back Card Logic
 */

onCardReady(function () {
    var word = getFieldValue('#wordValue');

    // 1. Apply color to PartOfSpeech
    applyPosColor();

    // 2. Normalize IPA (remove extra slashes)
    normalizeIPA('#ipaBack');

    // 3. Highlight the word in example sentence
    if (word) {
        applyHighlight('#exampleSentence', word);
    }

    // 4. Parse and display tags as individual badges
    var tagsContainer = document.getElementById('tagsContainer');
    if (tagsContainer) {
        var tagsText = tagsContainer.textContent.trim();
        if (tagsText) {
            var tags = tagsText.split(/\s+/).filter(function (tag) {
                return tag.length > 0;
            });
            tagsContainer.innerHTML = tags.map(function (tag) {
                return '<span class="tag">' + tag + '</span>';
            }).join('');
        }
    }

    // 5. Parse and display collocations as individual chips
    var collocContainer = document.getElementById('collocationsContainer');
    if (collocContainer) {
        var collocText = collocContainer.textContent.trim();
        if (collocText) {
            var delimiter = collocText.indexOf('|') !== -1 ? '|' : (collocText.indexOf(';') !== -1 ? ';' : null);
            if (delimiter) {
                var items = collocText.split(delimiter).map(function (item) {
                    return item.trim();
                }).filter(function (item) {
                    return item.length > 0;
                });
                collocContainer.innerHTML = items.map(function (item) {
                    return '<span class="collocation-chip">' + item + '</span>';
                }).join('');
            } else {
                collocContainer.innerHTML = '<span class="collocation-chip">' + collocText + '</span>';
            }
        }
    }
});
