# Walk the Work

A single-page landing site for **Walk the Work** — a 1:1 walking decision practice based in London.

## Technologies

| Layer | Technology |
|-------|------------|
| Frontend | React 19 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Form delivery | FormSubmit |
| Deployment | GitHub Pages |
| Language | TypeScript 5.7 |

## Local setup

```bash
npm install
npm run dev
```

This starts the site at [http://localhost:3000](http://localhost:3000).

To test the production bundle locally:

```bash
npm run build
npm run preview
```

## GitHub Pages

This repo is configured for GitHub Pages deployment through GitHub Actions.

- The workflow lives at [.github/workflows/deploy.yml](/Users/danielbloomberg/My%20Apps/Walk%20The%20Work%20Site/.github/workflows/deploy.yml).
- The custom domain file is [public/CNAME](/Users/danielbloomberg/My%20Apps/Walk%20The%20Work%20Site/public/CNAME).
- The build also creates `dist/404.html` so direct visits to old client-side paths still fall back to the landing page.

## Form handling

The enquiry form posts to FormSubmit and sends to `daniel@danielbloomberg.com` with subject `Walk The Work Enquiry`.

Important:

1. The first real submission to a new FormSubmit endpoint triggers an email confirmation step.
2. After that confirmation, future submissions should go straight through.

## Notes

- Booking: Calendly → Stripe (configured in [src/routes/index.tsx](/Users/danielbloomberg/My%20Apps/Walk%20The%20Work%20Site/src/routes/index.tsx:249))
- Contact: `daniel@danielbloomberg.com`
