# 🔐 Phase 1 — Authentication

**Goal**: Implement end-to-end authentication: login, token refresh, logout, and "get me" — both the API layer and the React auth context/hooks.

**Status**: ✅ Completed
**Depends on**: Phase 0

---

## Scope

Backend `auth` domain (all 4 layers) + frontend `auth` domain (hooks, pages, context).
A user can log in, receive a short-lived JWT access token + long-lived refresh cookie, and the app correctly stores/uses the token on subsequent requests.

---

## 📁 Backend Files (`api/src/domains/auth/`)

| File | Responsibility |
|---|---|
| `auth.router.ts` | Register `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` |
| `auth.controller.ts` | Parse req body → call service → return response envelope |
| `auth.service.ts` | Validate credentials (Supabase Auth), sign JWTs, decode refresh token |
| `auth.dto.ts` | Zod: `LoginDto` (`email`, `password`) |

**Supporting shared files** (already from Phase 0):
- `auth.middleware.ts` — verify JWT, attach `req.user`, call `next()` or 401
- `requireRole.middleware.ts` — factory returning role guard middleware

---

## 📁 Frontend Files (`app/src/domains/auth/`)

| File | Responsibility |
|---|---|
| `hooks/useLogin.ts` | React Query mutation for `POST /auth/login` |
| `hooks/useLogout.ts` | Mutation for `POST /auth/logout`, clears token |
| `hooks/useMe.ts` | Query for `GET /auth/me`, used on app boot |
| `pages/LoginPage.tsx` | Login form page (email + password) |
| `components/LoginForm.tsx` | Controlled form component |

**Shared auth state** (`app/src/shared/`):
- `hooks/useAuth.ts` — consumes `AuthContext`
- Create `AuthContext.tsx` in `shared/` — holds `user`, `accessToken`, `setUser`, `logout`

---

## 🔑 API Endpoints

| Method | Endpoint | Access | Key Behavior |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Public | Verify email+pass via Supabase Auth → sign access+refresh JWTs → set HttpOnly cookie |
| `POST` | `/api/v1/auth/refresh` | Public | Read refresh cookie → verify → issue new access token |
| `POST` | `/api/v1/auth/logout` | Authenticated | Clear refresh cookie |
| `GET` | `/api/v1/auth/me` | Authenticated | Return `req.user` from JWT payload |

**JWT Payload shape:**
```typescript
{
  sub: string;    // user's DB id (cuid)
  email: string;
  role: 'ADMIN' | 'USER';
  name: string;
}
```

---

## ✅ Acceptance Criteria

- [x] `POST /auth/login` with valid credentials returns `accessToken` + sets `refreshToken` HttpOnly cookie
- [x] `POST /auth/login` with invalid credentials returns `401` with error envelope
- [x] `POST /auth/refresh` with valid refresh cookie issues a new access token
- [x] `POST /auth/logout` clears the refresh cookie
- [x] `GET /auth/me` with valid Bearer token returns user profile
- [x] `GET /auth/me` without token returns `401`
- [x] Frontend `AuthContext` is populated on app load via `GET /auth/me`
- [x] Axios interceptor silently refreshes expired access token and retries original request
- [x] After login, ADMIN is redirected to `/admin`, USER to `/`
- [x] Login page uses Forest theme colors and Inter/Geist font

---

## 🔗 References
- Doc 2 §7 (Auth & JWT strategy), §6.2 (response envelope)
- Doc 3 Part C → Auth endpoints
