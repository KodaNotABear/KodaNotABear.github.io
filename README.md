# akuro.studio

Personal portfolio of **Ethan Peterson**, a game programmer and designer building under the AKURO STUDIO label.

**Live site → [akuro.studio](https://akuro.studio)**

## Stack

- [React 19](https://react.dev) + [Vite 8](https://vite.dev)
- [React Router v7](https://reactrouter.com) for client-side routing, with a GitHub Pages 404 redirect shim
- [Framer Motion](https://www.framer.com/motion/) for page transitions and scroll reveals
- CSS Modules with a custom design-token system (`src/styles/global.css`)
- Hosted on GitHub Pages behind Cloudflare

## Development

```bash
npm install
npm run dev      # local dev server
npm run lint     # eslint
npm run build    # production build to dist/
npm run deploy   # build + publish to gh-pages
```

## Things to find

The site has a few secrets. Try the Konami code, or press `?` to see what else is listening.

## Structure

```
src/
  components/   # shared UI + easter eggs (snake, d20, text adventure...)
  data/         # projects and devlog posts. edit these to add content
  pages/        # one component per route
  styles/       # global design tokens and base styles
scripts/        # build-time asset generation (og image, card art)
```
