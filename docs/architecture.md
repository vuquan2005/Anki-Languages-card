# Architecture & Concepts

This document covers the core architecture, Anki template concepts, and design decisions behind **Anki Languages Card**.

---

## 🧩 Anki Template Concepts

### Template Syntax
Anki uses a Mustache-like templating syntax:
- `{{FieldName}}`: Displays the content of the field.
- `{{#FieldName}}...{{/FieldName}}`: **Conditional block** — renders only if the field is not empty.
- `{{^FieldName}}...{{/FieldName}}`: **Inverse conditional block** — renders only if the field is empty.
- `{{FrontSide}}`: Available only on the Back template; includes the rendered Front template.

### Special Anki CSS Classes
Anki automatically injects specific CSS classes into the document context during card reviews:
- `.card`: Applied to the card container / body element.
- `.nightMode` / `.night_mode`: Added when dark mode is active in desktop, AnkiDroid, or AnkiMobile.
- `.replay-button`: Generated for audio playback elements (`[sound:...]`).

---

## 🏛️ Architectural & Design Decisions

### 1. Zero-Runtime & Self-Contained Bundles
* **Constraint**: Anki does not allow cards to load external JavaScript modules or separate CSS files at runtime. Everything must be self-contained within the card's Front Template, Back Template, and Styling section.
* **Solution**: The build script ([`scripts/build.js`](../scripts/build.js)):
  - Compiles Tailwind CSS utilities and common variables into a single `style.css`.
  - Inlines shared helper logic ([`src/common/utils.js`](../src/common/utils.js)) directly into `<script>` tags in `front.html` and `back.html`.
  - Generates distribution-ready outputs in `dist/` with zero runtime library overhead.

### 2. Tailwind CSS with Zero-Preflight
* Anki has its own base styles for reviews and menus. Standard Tailwind preflight (CSS reset) can conflict with or break Anki's native UI elements.
* Therefore, `corePlugins: { preflight: false }` is enabled in `tailwind.config.js`, allowing utility classes to coexist harmoniously with Anki's built-in stylings.

### 3. System Font Stacks Over External Web Fonts
* **Constraint**: Loading web fonts (like Google Fonts) over the network fails in offline environments, causes layout shifts (FOIT/FOUT), and often fails to load on mobile platforms (AnkiDroid / AnkiMobile).
* **Solution**: The template relies on high-quality system font stacks (`Inter`, `'Segoe UI'`, `Roboto`, `-apple-system`, `sans-serif`) for consistent, instantaneous, and offline-reliable rendering.

### 4. Client-Side POS & IPA Normalization
* **Constraint**: Users often enter Parts of Speech or IPA transcriptions in inconsistent formats (e.g., `adj`, `adj.`, `n [c]`, `noun [u]`, `//həˈloʊ//`).
* **Solution**: Client-side regex parsing runs on card load to:
  - Normalize labels into consistent, readable forms (`Noun [C]`, `Adj`, etc.).
  - Dynamically attach color-coded badges based on the grammar class.
  - Strip excessive leading and trailing slashes from IPA strings.

---

## 📚 Related Resources

- [Anki Manual - Templates Intro](https://docs.ankiweb.net/templates/intro.html)
- [Anki Manual - Template Fields](https://docs.ankiweb.net/templates/fields.html)
- [Anki Manual - Styling & HTML](https://docs.ankiweb.net/templates/styling.html)
- [AnkiConnect Add-on Documentation](https://foosoft.net/projects/anki-connect/)
