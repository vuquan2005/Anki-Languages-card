# Anki Languages Card 🎴

Modern, minimalist Anki card templates for language learning — now equipped with **Vite Dev Studio**, **Tailwind CSS**, and **AnkiConnect One-Click Auto-Sync**.

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38bdf8)
![Vite](https://img.shields.io/badge/Vite-v8-646cff)

## ✨ Features

- **Clean Design** - Modern, distraction-free UI with soft colors and clear typography
- **Zero-Runtime Overhead** - Compiled into hyper-fast, pure static HTML/CSS with zero runtime libraries in Anki
- **Live Dev Studio** - Preview Front and Back templates side-by-side in browser with mock data and HMR
- **Auto-Sync to Anki** - Push compiled templates directly into Anki with a single command via AnkiConnect
- **Tailwind CSS Engine** - Utility-first styling with custom POS color tokens, zero preflight conflicts, and `.nightMode` support
- **Smart Card Features**:
  - Auto-highlight target word in example sentences
  - POS normalization (`adj` → `Adj`, `n [c]` → `Noun [C]`) with color coding
  - IPA normalization (cleans up irregular slashes `//...//`)
  - Direct Cambridge Dictionary & Google Translate links
  - Space-separated tags rendered as sleek badges

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
git clone https://github.com/vuquan2005/Anki-Languages-card.git
cd Anki-Languages-card
pnpm install   # hoặc npm install
```

### 2. Live Preview in Browser (Dev Mode)

Run the Vite Dev Studio to design and test your cards with instant Hot Module Replacement:

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser to:
- Switch between sample cards (`serendipity`, `ephemeral`, `ubiquitous`).
- Toggle **☀️ Light Mode / 🌙 Dark Mode**.
- Toggle **💻 Desktop / 📱 Mobile (390px)** simulated views.

### 3. Build & Auto-Sync to Anki ⚡

> **Prerequisite**: Make sure the Anki app is open and has the [AnkiConnect](https://ankiweb.net/shared/info/2055492159) add-on installed (Code: `2055492159`).

Compile and push straight to Anki with **one command**:

```bash
pnpm build:sync
```

*(Or run `pnpm build` followed by `pnpm sync`)*

---

## 🛠️ Manual Installation (Alternative)

If you do not use AnkiConnect:
1. Run `pnpm build` (or download the pre-compiled templates from **Releases** / **GitHub Actions Artifacts**).
2. Open Anki → **Tools** → **Manage Note Types**
3. Select your Note Type (or create a new one) → Click **Cards...**
4. Copy content from `dist/01_word/`:
   - `front.html` → **Front Template**
   - `back.html` → **Back Template**
   - `style.css` → **Styling**

---

## 📋 Note Type Fields

| Field | Required | Description |
|-------|:--------:|-------------|
| `Word` | **Yes** | Vocabulary word |
| `Meaning` | **Yes** | Definition |
| `IPA` | No | Phonetic transcription (e.g. `/ˌser.ənˈdɪp.ə.ti/`) |
| `PartOfSpeech` | No | `noun [c]`, `adj`, `verb`, `adv`, etc. |
| `ExampleSentence` | No | Example sentence (target word is auto-highlighted) |
| `collocations pattern`| No | Common collocations |
| `image` | No | Card image (`<img ...>`) |
| `Audio` | No | Pronunciation audio (`[sound:word.mp3]`) |
| `Notes` | No | Usage notes or etymology |
| `Tags` | No | Space-separated tags rendered as chips |

---

## 📁 Project Structure

```text
├── index.html                  # Dev Studio preview page
├── vite.config.mjs             # Vite configuration
├── tailwind.config.js          # Tailwind CSS (Anki-tailored: no preflight, nightMode)
├── postcss.config.js           # PostCSS configuration
├── scripts/
│   ├── build.js                # Compiles Tailwind & bundles dist templates
│   └── sync.js                 # AnkiConnect auto-sync script
├── src/
│   ├── preview/                # Dev Studio mock data & renderer
│   │   ├── mockData.js
│   │   ├── renderAnki.js
│   │   └── preview.js
│   ├── common/
│   │   ├── style.css           # Global typography & Anki variables
│   │   └── utils.js            # Card logic (POS, IPA, highlight)
│   └── card_types/
│       └── word/               # Word card template
│           ├── front.html
│           ├── back.html
│           ├── front.js
│           ├── back.js
│           └── style.css
├── dist/                       # Self-contained bundles for Anki
│   └── 01_word/
│       ├── front.html
│       ├── back.html
│       └── style.css
├── docs/                       # Guides
└── package.json
```

---

## 🎨 Customization

### Colors & Styling
- Edit colors and design tokens in `tailwind.config.js` or CSS variables in `src/common/style.css`.
- Classes from Tailwind CSS are automatically scanned, compiled, and purged during `npm run build`.

### Adding New Card Types
1. Create a folder in `src/card_types/{type_name}/`
2. Add `front.html`, `back.html`, `front.js`, `back.js`, and optional `style.css`.
3. Register the folder in `scripts/build.js` (`CARD_TYPE_MAP`).
4. Run `npm run build`.

---

## 📄 License

MIT License - see [LICENSE](LICENSE)
