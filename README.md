# Anki Languages Card 🎴

Modern, minimalist Anki card templates for language learning.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Clean Design** - Modern, distraction-free UI
- **Dark Mode** - Auto-switches with Anki's night mode
- **Responsive** - Works on Desktop, AnkiDroid, AnkiMobile
- **Smart Features**:
  - Auto-highlight word in example sentences
  - POS normalization (`adj` → `Adj`, `n [c]` → `Noun [C]`)
  - Tags parsing (space-separated → badges)

## 📸 Preview

| Light Mode | Dark Mode |
|------------|-----------|
| ![Light](docs/preview-light.png) | ![Dark](docs/preview-dark.png) |

## 🚀 Quick Start

### 1. Build

```bash
git clone https://github.com/yourusername/Anki-Languages-card.git
cd Anki-Languages-card
node build.js
```

### 2. Install in Anki

1. Open Anki → Tools → Manage Note Types
2. Create or select a Note Type
3. Click **Cards...**
4. Copy content from `dist/01_word/`:
   - `front.html` → **Front Template**
   - `back.html` → **Back Template**
   - `style.css` → **Styling**

### 3. Create Fields

Required fields in your Note Type:

| Field | Description |
|-------|-------------|
| `Word` | The vocabulary word |
| `Meaning` | Definition |

Optional fields:

| Field | Description |
|-------|-------------|
| `IPA` | Phonetic transcription |
| `PartOfSpeech` | noun, verb, adj, etc. |
| `ExampleSentence` | Example usage |
| `collocations pattern` | Common collocations |
| `image` | Image field |
| `Notes` | Additional notes |

## 📁 Project Structure

```
├── src/
│   ├── common/
│   │   ├── style.css      # Shared styles
│   │   └── utils.js       # Utility functions
│   └── card_types/
│       └── word/          # Word card type
│           ├── front.html
│           ├── back.html
│           ├── front.js
│           └── back.js
├── dist/                  # Build output
├── docs/                  # Documentation
├── build.js               # Build script
└── package.json
```

## 🎨 Customization

### Colors

Edit CSS variables in `src/common/style.css`:

```css
:root {
  --accent-primary: #26A69A;    /* Main accent */
  --pos-noun: #1E88E5;          /* Noun color */
  --pos-verb: #E53935;          /* Verb color */
  /* ... */
}
```

### Adding Card Types

1. Create folder in `src/card_types/your_type/`
2. Add `front.html`, `back.html`, `front.js`, `back.js`
3. Run `node build.js your_type`

## 📖 Documentation

- [Installation Guide](docs/installation.md)
- [Customization Guide](docs/customization.md)
- [Field Reference](docs/fields.md)

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

Made with ❤️ for language learners
