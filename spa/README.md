# Portfolio SPA

A React + Vite + TypeScript Single Page Application refactored from the original multi-page portfolio site.

## Features

- **React 18** with TypeScript
- **React Router v6** for client-side routing
- **Route-based code splitting** for optimal performance
- **Pixel-perfect parity** with original design
- **Particle background system** (gravity well on home, 3D particles on other pages)
- **Interactive animations** (name glitch, subtitle typing, wave effects)
- **Project showcase** with carousel, filters, and modals
- **SEO optimized** with react-helmet-async
- **Accessibility** (ARIA labels, focus management)

## Prerequisites

- Node.js 18+ and npm

## Installation

```bash
cd spa
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Building

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
spa/
├── src/
│   ├── components/      # Shared React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ParticleBackground.tsx
│   │   ├── MouseFollower.tsx
│   │   ├── ProjectModal.tsx
│   │   └── ImageViewer.tsx
│   ├── routes/         # Route components
│   │   ├── Home.tsx
│   │   ├── Projects.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── styles/         # Global CSS
│   │   └── globals.css
│   ├── lib/           # Utilities and data
│   │   └── projectData.ts
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── public/            # Static assets (images, documents)
├── index.html
├── vite.config.ts
└── package.json
```

## Deployment

### GitHub Pages

1. Build the project: `npm run build`
2. Copy the `dist/` folder contents to your GitHub Pages directory
3. Ensure `index.html` is in the root
4. Configure base path in `vite.config.ts` if using a subdirectory:

```typescript
export default defineConfig({
  base: '/portfolio/',  // If deploying to /portfolio/
  // ... rest of config
})
```

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Vercel

1. Connect your repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

## Performance Optimizations

- **Route-based code splitting**: Non-home routes are lazy-loaded
- **Image lazy loading**: Images below the fold use `loading="lazy"`
- **Route prefetching**: Routes are prefetched on idle using `requestIdleCallback`
- **Manual chunking**: Vendor code is split into separate chunks
- **CSS extraction**: All styles consolidated in `globals.css`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Images should be placed in `/public/images/`
- Documents should be placed in `/public/documents/`
- The particle system automatically adapts based on the current route
- All animations and interactions are preserved from the original site

## License

Copyright © 2024 Nicholas Burgo. All rights reserved.


