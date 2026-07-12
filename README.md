# Shell Application — Enterprise Micro Frontend Platform

## Architecture

The Shell App is the host application in a Module Federation micro-frontend architecture. It owns the global shell infrastructure and loads remote Micro Frontends (MFEs) at runtime.

```
Shell App (Host)
├── Global Layout (Header, Sidebar, Footer)
├── Authentication (MSAL / @rajmohancoder/auth-sdk)
├── Route Orchestration (React Router v6)
├── Shared Context (user, roles, permissions, tenant, feature flags)
├── Error Boundaries (global + per-module)
└── Module Federation (@originjs/vite-plugin-federation)
    ├── Customer Management (remote)
    ├── Orders (remote)
    ├── Analytics (remote)
    └── Administration (remote)
```

### Key Principles

- **Shell owns infrastructure, not business logic.**
- Remote MFEs are loaded lazily via `React.lazy` + `Suspense`.
- Failures in one remote do not affect others (module-level error boundaries).
- Adding a new remote requires minimal changes to the shell.

## Routing

| Path | Component | Guarded | Remote |
|------|-----------|---------|--------|
| `/` | Dashboard | Yes | No |
| `/customers/*` | Customer MFE | Yes | Yes |
| `/orders/*` | Orders MFE | Yes | Yes |
| `/analytics/*` | Analytics MFE | No | Yes |
| `/admin/*` | Admin MFE | Yes (admin:users) | Yes |
| `/unauthorized` | Unauthorized | No | No |
| `*` | NotFound | No | No |

All routes except `/unauthorized` and `*` require authentication.

## Remote Loading

Remotes are registered in `src/federation/remotes.ts`.

The `RemoteLoader` component handles:

1. **Lazy loading** via `React.lazy` and dynamic `import()`
2. **Suspense** with a loading spinner fallback
3. **ModuleErrorBoundary** catching load failures gracefully
4. **Retry** — user can retry after a failure

### Adding a New Remote MFE

To add a new remote, three changes are needed:

1. **Add its URL** to `.env.development` and `.env.production`:
   ```
   VITE_NEW_MFE_REMOTE=http://localhost:3005
   ```

2. **Register it** in `src/federation/remotes.ts`:
   ```ts
   {
     name: 'new-mfe',
     displayName: 'New MFE',
     routePath: '/new-mfe/*',
     modulePath: './NewMfeApp',
     requiredPermission: 'some:permission',
     navOrder: 5,
   }
   ```

3. **Add the dynamic import** in `src/federation/remoteLoader.ts`:
   ```ts
   const remoteImports: Record<string, () => Promise<RemoteModule>> = {
     // ... existing
     'new-mfe': () => import('new-mfe/NewMfeApp'),
   };
   ```

That is all. The route is registered automatically from `remotes.ts`.

## Project Structure

```
src/
├── app/
│   ├── App.tsx                  # Root component (BrowserRouter + providers)
│   └── providers/               # Provider composition
├── auth/                        # MSAL / Auth config
├── components/
│   └── ErrorBoundary/           # GlobalErrorBoundary + ModuleErrorBoundary
├── config/                      # App configuration, environment
├── contexts/
│   └── SharedContext.tsx        # Shared shell context provider
├── federation/
│   ├── remoteLoader.ts          # Lazy-loads remote MFEs
│   └── remotes.ts               # Central remote registry
├── hooks/                       # Re-exported hooks
├── layout/
│   ├── Header/                  # App header (auth status, user menu)
│   ├── Sidebar/                 # Navigation sidebar
│   ├── Footer/                  # App footer
│   └── MainLayout/              # Composed layout with <Outlet />
├── pages/
│   ├── Dashboard.tsx            # Shell dashboard (no business logic)
│   ├── NotFound.tsx             # 404 page
│   └── Unauthorized.tsx         # 403 page
├── routes/
│   ├── AppRoutes.tsx            # All route definitions
│   ├── ProtectedRoute.tsx       # Auth + permission guard
│   └── RemoteLoader.tsx         # Lazy-load + error boundary wrapper
├── services/                    # Service layer (placeholder)
├── styles/
│   └── index.css                # Tailwind imports
├── types/                       # Shell-specific TypeScript types
├── utils/                       # Utility functions
└── main.tsx                     # Application entry point
```

## Tech Stack

- **React 18** with TypeScript (strict)
- **Vite 6** with `@originjs/vite-plugin-federation`
- **React Router v6**
- **Tailwind CSS 3**
- **pnpm** (package manager)
- **@rajmohancoder/auth-sdk** (authentication)
- **@rajmohancoder/api-client** (HTTP client)
- **@rajmohancoder/events** (event types)
- **@rajmohancoder/types** (shared domain types)

## Dependencies

This project depends on four shared packages published to GitHub Packages under the `@rajmohancoder` scope:

| Package | Version |
|---------|---------|
| `@rajmohancoder/api-client` | ^0.1.1 |
| `@rajmohancoder/auth-sdk` | ^0.1.0 |
| `@rajmohancoder/events` | ^0.1.0 |
| `@rajmohancoder/types` | ^0.1.0 |

## Installation

```bash
pnpm install
```

The packages are fetched from GitHub Packages (`https://npm.pkg.github.com`). Authentication is configured in the project's `.npmrc` file:

```
@rajmohancoder:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_YourTokenHere
```

The token must be a GitHub Personal Access Token (classic) with **`read:packages`** scope and access to the `rajmohancoder/shared-libs` repository.

> **Note:** `.npmrc` is gitignored to prevent accidentally committing the token.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Type-check + production build |
| `npm run typecheck` | Type-check only (`tsc -b --noEmit`) |
| `npm run preview` | Preview production build |

## Environment Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `VITE_CUSTOMER_REMOTE` | `http://localhost:3001` | `/mfe/customer` |
| `VITE_ORDERS_REMOTE` | `http://localhost:3002` | `/mfe/orders` |
| `VITE_ANALYTICS_REMOTE` | `http://localhost:3003` | `/mfe/analytics` |
| `VITE_ADMIN_REMOTE` | `http://localhost:3004` | `/mfe/admin` |
| `VITE_API_URL` | `http://localhost:8080/api` | `/api` |
