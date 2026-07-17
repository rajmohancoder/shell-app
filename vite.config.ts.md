# Vite Config — Shell App (Module Federation Host)

## Overview

This is the Vite config for the **shell (host)** application. It uses `vite-plugin-federation` to load 4 remote micro-frontends and provides shared dependencies to avoid duplicate bundles.

---

## Federation Config

| Option | Value | Purpose |
|---|---|---|
| `name` | `'shell'` | Unique identifier for this federated module |
| `version` | `'1.0.0'` | Helps the shared resolution algorithm match versions predictably |

### Remotes (Micro-Frontends)

Each remote is pointed to its `remoteEntry.js` URL. The URL is constructed as:

```
{REMOTE_BASE_URL}/assets/remoteEntry.js
```

| Remote | Env Variable | Fallback (dev) |
|---|---|---|
| customer | `VITE_CUSTOMER_REMOTE` | `https://customer-management-ashen.vercel.app` |
| orders | `VITE_ORDERS_REMOTE` | `http://localhost:3002` |
| analytics | `VITE_ANALYTICS_REMOTE` | `http://localhost:3003` |
| admin | `VITE_ADMIN_REMOTE` | `http://localhost:3004` |

The env variables are loaded per-mode via `loadEnv(mode, process.cwd(), '')`. Set them in `.env.development`, `.env.production`, or override inline:

```bash
VITE_CUSTOMER_REMOTE=https://customer-management-ashen.vercel.app pnpm dev
```

### Shared Dependencies

Libraries shared between the shell and all remotes to prevent duplicate loading:

| Library | singleton | eager | requiredVersion |
|---|---|---|---|
| `react` | ✅ | ✅ | `^18.0.0` |
| `react-dom` | ✅ | ✅ | `^18.0.0` |
| `react-router-dom` | ✅ | ✅ | `^6.0.0` |

- **`singleton: true`** — Ensures only one instance of the library exists across the shell and all remotes.
- **`eager: true`** — Bakes these libs into the shell's initial chunk so remotes get them synchronously without an extra async fetch (avoids waterfall delay).
- **`requiredVersion`** — Declares which versions are compatible.

---

## Resolve Alias

```ts
'@': path.resolve(__dirname, 'src')
```

Allows imports like `import Foo from '@/components/Foo'` instead of relative paths.

---

## Build Options

| Option | Value | Purpose |
|---|---|---|
| `target` | `'esnext'` | Output modern JS — smaller bundles, no legacy transpilation |
| `modulePreload.polyfill` | `false` | Skip the module preload polyfill (~2KB) since we target modern browsers |

---

## Overriding Env Variables at Runtime

No need to edit files. Override any env variable inline:

```bash
VITE_CUSTOMER_REMOTE=https://staging-customer.example.com pnpm dev
```
