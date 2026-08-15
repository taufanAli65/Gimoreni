# 🏗️ Phase 0 — Foundation & Infrastructure

**Goal**: Scaffold the entire monorepo from scratch, wire up all tooling, connect Supabase/Prisma, and validate the environment before any feature code is written.

**Status**: ✅ Completed

---

## Scope

This phase produces a working, runnable skeleton: both API and App servers start without errors, the DB is migrated, and all environment variables are validated.

---

## 📁 Files to Create

### Root (Monorepo)
- `package.json` — npm workspaces: `["api", "app"]`
- `.env` — real secrets (gitignored)
- `.env.example` — template with all keys documented
- `.gitignore`
- `tsconfig.base.json` — shared strict TS config

### `api/`
- `package.json` — dependencies: express, prisma, @prisma/client, zod, jsonwebtoken, cookie-parser, cors, express-rate-limit, bcryptjs, dotenv, tsx
- `tsconfig.json` — extends base, paths, outDir
- `src/app.ts` — Express app factory (rate limit → cors → json → routes → errorHandler)
- `src/index.ts` — entry point (import app, listen on PORT)
- `src/config/env.ts` — Zod schema validating all env vars
- `src/config/supabase.ts` — Supabase admin client (service_role key)
- `src/shared/middleware/errorHandler.middleware.ts`
- `src/shared/middleware/rateLimit.middleware.ts` — 100 req/15min global, 10 req/15min for `/auth/*`
- `src/shared/middleware/pagination.middleware.ts` — attaches `req.pagination`
- `src/shared/utils/response.util.ts` — `success()` and `error()` helpers
- `src/shared/utils/AppError.ts` — base custom error class
- `src/shared/types/express.d.ts` — augment `Request` with `user` and `pagination`
- `src/shared/constants/roles.ts` — `Role` enum
- `prisma/schema.prisma` — full schema from Doc 3 (all 8 models)

### `app/`
- `package.json` — dependencies: react, react-dom, react-router-dom, @tanstack/react-query, axios, tailwindcss, shadcn/ui, browser-image-compression, sonner
- `tsconfig.json` — strict, vite paths
- `vite.config.ts`
- `tailwind.config.ts` — custom colors from palette
- `src/main.tsx` — QueryClientProvider + AuthProvider + AppRouter
- `src/App.tsx`
- `src/index.css` — Tailwind directives + CSS vars for the Forest theme
- `src/router/AppRouter.tsx` — top-level router (redirects based on role)
- `src/router/AdminRoutes.tsx` — role guard → `/admin/*`
- `src/router/UserRoutes.tsx` — role guard → `/*`
- `src/shared/lib/api.ts` — Axios instance with interceptors
- `src/shared/lib/imageCompression.ts` — `compressImage()` wrapper
- `src/shared/hooks/useAuth.tsx` — AuthContext consumer hook
- `src/shared/components/layout/AdminLayout.tsx`
- `src/shared/components/layout/UserLayout.tsx`

---

## ✅ Acceptance Criteria

- [x] `npm run dev` in `api/` starts Express on port 3001 without errors
- [x] `npm run dev` in `app/` starts Vite dev server on port 5173
- [x] `npx prisma migrate dev` runs successfully and all 8 tables exist in Supabase
- [x] `src/config/env.ts` throws a descriptive error if any required env var is missing
- [x] Rate limiting middleware is the FIRST middleware registered in `app.ts`
- [x] Axios interceptors handle 401 → token refresh flow
- [x] Forest theme colors are defined as CSS vars and Tailwind custom tokens
- [x] `.env.example` has all keys with placeholder values

---

## 🔗 References
- Doc 2 §1 (Tech Stack), §2 (Directory Structure), §8 (Env Vars), §9 (Error Handling)
- Doc 3 Part A (Prisma Schema), Part D (RLS — apply all policies after migration)
