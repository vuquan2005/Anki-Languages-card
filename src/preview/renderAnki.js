/**
 * Minimal Anki mustache parser for live preview
 */
export function renderAnkiTemplate(templateHtml, fields) {
  let html = templateHtml;

  // 1. Conditionals: {{#FieldName}}content{{/FieldName}}
  html = html.replace(/\{\{#([a-zA-Z0-9_ ]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, fieldName, content) => {
    const val = fields[fieldName];
    if (val && typeof val === 'string' && val.trim() !== '') {
      return content;
    }
    return '';
  });

  // 2. Inverted conditionals: {{^FieldName}}content{{/FieldName}}
  html = html.replace(/\{\{\^([a-zA-Z0-9_ ]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, fieldName, content) => {
    const val = fields[fieldName];
    if (!val || (typeof val === 'string' && val.trim() === '')) {
      return content;
    }
    return '';
  });

  // 3. Field replacements: {{FieldName}}
  html = html.replace(/\{\{([a-zA-Z0-9_ ]+)\}\}/g, (_, fieldName) => {
    if (fieldName === 'Audio') {
      return '<a href="javascript:void(0)" class="replay-button" title="Audio play">🔊</a>';
    }
    return fields[fieldName] !== undefined ? fields[fieldName] : '';
  });

  return html;
}
