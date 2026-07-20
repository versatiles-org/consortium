# @versatiles/consortium

Landing page and open letter for founding the **VersaTiles consortium**, deployed at
[versatiles.org/consortium](https://versatiles.org/consortium).

Built with SvelteKit + `@sveltejs/adapter-static` (a fully prerendered static site),
bilingual (`/de`, `/en`).

## Develop

```sh
npm install
npm run dev      # served from the dev-server root (BASE_PATH empty)
```

## Build

```sh
npm run build    # sets BASE_PATH=/consortium and prerenders into ./build
npm run preview
```

The production build assumes deployment under the `/consortium` path. To build for a
different base, set `BASE_PATH` yourself, e.g. `BASE_PATH= npm run build` for the root.

## Editing content

- **UI strings** (headings, labels, CTAs, sector names, demo links), per language:
  `src/content/<locale>/ui.yaml`
- **Open letter** (Markdown prose), per language: `src/content/<locale>/letter.md`
- **Locale-neutral config** (contact + donation links, demo video): `src/lib/content.ts`

`src/lib/copy.ts` only loads those files, validates them (Zod) and renders the
Markdown at build time — you normally don't touch it.
