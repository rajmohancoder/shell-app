# Authorization Setup Guide

## Why Was Authorization Temporarily Disabled?

Authorization was temporarily disabled for the `/customers` route to verify that the **Customer Management Micro Frontend (MFE)** is correctly integrated with the Shell Application and loads successfully. Once this integration is confirmed, authorization should be re-enabled to restore the intended security model.

## Files Modified

| File | Change |
|------|--------|
| `src/federation/remotes.ts` | Commented out `requiredPermission: 'customer:view'` for the `customer` remote app entry |
| `src/routes/AppRoutes.tsx` | Bypassed `ProtectedRoute` wrapper for the customer route; renders `RemoteLoader` directly |

## Authorization Logic Temporarily Disabled

Two layers of authorization were disabled:

### Layer 1: Route-level `ProtectedRoute` bypass (authentication + authorization)

**File:** `src/routes/AppRoutes.tsx` (lines 21–43)

The `ProtectedRoute` component performs two checks:
1. **Authentication** (line 26 of `ProtectedRoute.tsx`): If the user is not logged in (`!isAuthenticated`), redirect to `/unauthorized`.
2. **Permission** (line 30 of `ProtectedRoute.tsx`): If the user lacks the required permission (e.g., `customer:view`), redirect to `/unauthorized`.

For the customer route only, the `ProtectedRoute` wrapper was removed entirely, so `RemoteLoader` renders directly without any auth check.

**Code bypassed in `AppRoutes.tsx`:**

```typescript
// The entire ProtectedRoute wrapper is replaced for the customer entry:
// <ProtectedRoute ...><RemoteLoader remoteName="customer" /></ProtectedRoute>
// ↓ becomes ↓
// <RemoteLoader remoteName="customer" />
```

### Layer 2: Permission configuration bypass

**File:** `src/federation/remotes.ts` — the `customer` remote object:

```typescript
// requiredPermission: 'customer:view',   // <-- temporarily disabled
```

This second layer is redundant while Layer 1 is active, but was left commented out for safety.

## How to Re-Enable Authorization

### Step-by-Step Instructions

1. **Open** `src/routes/AppRoutes.tsx`.
2. **Locate** the temporary bypass block (around lines 22–30). It's marked with a `TEMPORARY` comment.
3. **Restore** the original code by replacing the conditional with the standard mapping:

   ```typescript
   // Delete this entire block:
   remote.name === 'customer' ? (
     // TEMPORARY: ...
     <Route
       key={remote.name}
       path={remote.routePath}
       element={<RemoteLoader remoteName={remote.name} />}
     />
   ) : (
     // ... standard route
   )
   ```

   Replace with the original single expression inside the map:

   ```typescript
   {remoteApps.map((remote) => (
     <Route
       key={remote.name}
       path={remote.routePath}
       element={
         <ProtectedRoute
           requiredPermissions={
             remote.requiredPermission
               ? [remote.requiredPermission as Permission]
               : undefined
           }
         >
           <RemoteLoader remoteName={remote.name} />
         </ProtectedRoute>
       }
     />
   ))}
   ```

4. **Open** `src/federation/remotes.ts`.
5. **Uncomment** the `requiredPermission` line for the customer entry:
   ```typescript
   requiredPermission: 'customer:view',
   ```
6. **Save** both files.
7. **Verify** the build:
   ```bash
   npm run build
   ```
8. **Test** by navigating to `/customers` — unauthenticated users and users without `customer:view` should be redirected to `/unauthorized`.

### Files That Participate in Authorization

For awareness, these files also play a role in the authorization flow but do **not** need modification for re-enabling:

| File | Role |
|------|------|
| `src/routes/ProtectedRoute.tsx` | Route guard — checks authentication and permissions before rendering child routes |
| `src/layout/Sidebar/Sidebar.tsx` | Filters nav items based on `isPermissionAllowed()` — will automatically show/hide the Customer Management link based on the `requiredPermission` value |
| `src/utils/index.ts` | `isPermissionAllowed()` utility — returns `true` when no permission is required |
| `src/contexts/SharedContext.tsx` | Provides `permissions` array from the auth SDK |

## Prerequisites Before Re-Enabling Authorization

Before restoring the auth checks, ensure the following are in place:

1. **Authentication Provider** — The `@rajmohancoder/auth-sdk` MSAL provider is configured with valid Azure AD credentials in the environment (see `.env.development` / `.env.production`).
2. **User Permissions** — Users accessing `/customers` must have the `customer:view` permission assigned in the identity provider (Azure AD / Entra ID).
3. **Auth Configuration** — The MSAL configuration in `src/auth/authConfig.ts` has the correct `tenantId`, `clientId`, and `redirectUri` for the target environment.
4. **Permission Type** — The `Permission` type in `@rajmohancoder/types/dist/auth/permissions.d.ts` includes `'customer:view'` (it currently does).

## Verification Checklist

- [ ] `npm run dev` starts without errors
- [ ] Navigating to `/customers` loads the Customer Management dashboard
- [ ] Unauthenticated users are redirected to `/unauthorized`
- [ ] Authenticated users without `customer:view` are redirected to `/unauthorized`
- [ ] Authenticated users with `customer:view` can access the Customer Management dashboard
- [ ] The Shell layout (Header, Sidebar, Footer) renders correctly on all routes
- [ ] The Customer Management MFE can be navigated within (sub-routes work)
