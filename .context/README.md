# Context: Anki Card Template

## About This Project

This project provides modern, clean Anki card templates for language learning. The templates are designed to be visually appealing, functional, and easy to customize.

## Key Concepts

### Anki Template Syntax

- `{{FieldName}}` - Display field content
- `{{#FieldName}}...{{/FieldName}}` - Conditional: show only if field has content
- `{{^FieldName}}...{{/FieldName}}` - Inverse: show only if field is empty
- `{{FrontSide}}` - Include front template in back

### File Structure

- **style.css** - Shared CSS for both front and back
- **front.html** - Front template (question side)
- **back.html** - Back template (answer side)

### CSS Classes Used by Anki

- `.card` - Applied to card body
- `.nightMode` / `.night_mode` - Applied when dark mode is enabled
- `.replay-button` - Audio play button

## Design Decisions

### Why Build Tool?

Anki requires templates to be self-contained (no external files). The build tool:
1. Combines CSS + HTML + JS into single files
2. Inlines utilities into each template
3. Allows modular development

### Why No External Fonts?

Anki on mobile may not load external fonts reliably. We use system font stacks for consistency.

### Why Normalize POS?

Users enter part of speech in various formats (n, noun, n.). Normalization:
1. Provides consistent display
2. Enables color coding
3. Handles countable/uncountable nouns

## Related Resources

- [Anki Manual - Templates](https://docs.ankiweb.net/templates/intro.html)
- [Anki Manual - Fields](https://docs.ankiweb.net/templates/fields.html)
- [Anki Manual - Styling](https://docs.ankiweb.net/templates/styling.html)
