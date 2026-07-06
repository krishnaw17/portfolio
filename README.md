# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Contact form mail setup

The contact form now sends mail through a small Resend-backed server at `server/contact-server.js`.

Create a file named `.env` in the project root by copying `.env.example`, then fill in these values:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CONTACT_TO_EMAIL` (defaults to `krishnawadhwa2@gmail.com`)

Where to get them:

- `RESEND_API_KEY` comes from your Resend dashboard after creating an API key.
- `RESEND_FROM_EMAIL` must be a verified sender or verified domain in Resend.
- `CONTACT_TO_EMAIL` is your own inbox where you want to receive website messages.

How to set it up:

- Create a Resend account.
- Add and verify a sender email or domain in Resend.
- Copy the API key into `RESEND_API_KEY`.
- Use a verified sender address in `RESEND_FROM_EMAIL`.

Run both the Vite app and the mail server together with:

```bash
npm run dev:full
```

The form posts to `/api/contact`, which is proxied to the local mail server in development.
