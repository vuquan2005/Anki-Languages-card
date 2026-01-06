# Customization Guide

## Colors

### Edit Main Colors

Open `src/common/style.css` and modify the CSS variables:

```css
:root {
  /* Accent color (used for highlights, borders, tags) */
  --accent-primary: #26A69A;
  --accent-secondary: #00897B;
  
  /* Background colors */
  --bg-primary: #FAFAFA;
  --bg-card: #FFFFFF;
  
  /* Text colors */
  --text-primary: #212121;
  --text-secondary: #616161;
}
```

### Part of Speech Colors

```css
:root {
  --pos-noun: #1E88E5;    /* Blue */
  --pos-verb: #E53935;    /* Red */
  --pos-adj: #FB8C00;     /* Orange */
  --pos-adv: #8E24AA;     /* Purple */
}
```

### Dark Mode Colors

```css
.nightMode, .night_mode {
  --bg-primary: #1E1E1E;
  --bg-card: #2D2D2D;
  --text-primary: #E0E0E0;
  /* ... */
}
```

## Typography

### Font Sizes

```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-2xl: 2.25rem;   /* 36px - word */
}
```

### Font Family

```css
:root {
  --font-primary: 'Inter', 'Segoe UI', sans-serif;
  --font-mono: 'Roboto Mono', monospace;
}
```

## Layout

### Card Width

```css
.card-container {
  max-width: 600px;  /* Change this */
}
```

### Spacing

```css
:root {
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
}
```

## Adding New Card Types

1. Create folder: `src/card_types/your_type/`

2. Add required files:
   - `front.html`
   - `back.html`
   - `front.js`
   - `back.js`
   - `style.css` (optional overrides)

3. Build:
   ```bash
   node build.js your_type
   ```

4. Output will be in `dist/your_type/`

## Build Configuration

Edit `build.js` to change output folder names:

```javascript
const CARD_TYPE_MAP = {
  word: '01_word',
  listening: '02_listening',
  // Add more...
};
```
