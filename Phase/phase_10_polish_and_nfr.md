# ✨ Phase 10 — Polish, NFR Audit & Launch Readiness

**Goal**: Harden the application against all Non-Functional Requirements, audit every security surface, fix any remaining rough edges, and prepare for production hand-off.

**Status**: 🔲 Not Started
**Depends on**: Phase 9 (all features complete)

---

## Scope

No new features. This phase is a systematic audit pass over the entire codebase against Doc 1 §8 (NFRs), Doc 2 §5 (Code Constraints), and Doc 3 Parts D–E (RLS + Storage).

---

## 📋 Audit Checklist

### 🔒 Security & Auth
- [ ] Every protected route has `authenticate` middleware — no unguarded endpoints
- [ ] Every Admin-only endpoint has `requireRole('ADMIN')` middleware
- [ ] JWT secret rotation: verify `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are strong and not default values
- [ ] Refresh token is `HttpOnly` + `Secure` + `SameSite=Strict` in production
- [ ] CORS: `CLIENT_URL` is set correctly and not `*` in production

### 🛡️ RLS Audit (Supabase)
- [ ] All 8 tables have RLS enabled: `users`, `categories`, `transactions`, `quests`, `quest_redemptions`, `bonuses`, `streak_logs`, `notifications`
- [ ] All policies from Doc 3 Part D are applied in Supabase
- [ ] Storage bucket RLS: `redemption-proofs` (private) and `user-avatars` (public) policies from Doc 3 Part E are applied
- [ ] Verify with test accounts that cross-user data is inaccessible

### ⚡ Rate Limiting
- [ ] Global rate limit: 100 requests / 15 minutes applied as FIRST middleware in `app.ts`
- [ ] Auth-specific rate limit: 10 requests / 15 minutes on `/api/v1/auth/*`
- [ ] Verify 429 response uses standard error envelope

### 📦 Image Policy
- [ ] Every file upload flow (avatar, transaction receipt, quest proof) calls `compressImage()` before the upload API call
- [ ] Backend validates MIME type: only `image/jpeg`, `image/png`, `image/webp`
- [ ] Backend validates file size ≤ 500 KB as a secondary check (after client-side compression)

### 🧹 Code Quality
- [ ] Scan ALL files for violations of ≤ 300 line limit; refactor any exceeding files
- [ ] Search for `any` types without justification comments; add comment or fix type
- [ ] Remove all `console.log` debug statements (replace with proper logger if needed)
- [ ] Verify DDD layer discipline: grep for Prisma imports in controller files (must be 0)
- [ ] Verify DDD layer discipline: grep for `req`/`res` in service files (must be 0)

### 🕒 Timezone
- [ ] All `DateTime` fields in Prisma use UTC storage — verify in actual DB rows
- [ ] All date displays on frontend convert to local timezone (use `Intl.DateTimeFormat` or a date library)
- [ ] Streak check CRON uses UTC time for the 23:00 cutoff

### 📄 Pagination
- [ ] All list endpoints (`GET /users`, `/transactions`, `/quests`, `/redemptions`, `/bonuses`, `/notifications`) return `meta: { page, limit, total, totalPages }`
- [ ] Default `limit = 20`, max `limit = 100` enforced by `pagination.middleware.ts`

### 🎨 UI/UX Polish
- [ ] Consistent use of Forest color palette across all pages (no off-palette colors)
- [ ] Single font (Inter or Geist) — no system font fallbacks in use
- [ ] Loading states: all React Query `isLoading` states show a skeleton or spinner
- [ ] Empty states: all list views show a meaningful empty state message
- [ ] Error states: all queries show a user-friendly error message on failure
- [ ] All interactive elements have a hover/focus state
- [ ] Mobile: all touch targets ≥ 44×44px (audit User pages)
- [ ] Accessibility: all images have `alt` text, form labels are associated with inputs

### 🔧 Operational Readiness
- [ ] `.env.example` is complete and up to date with all variables
- [ ] CRON job endpoints (`/streaks/check`, `/streaks/remind`) are documented and secured (e.g., secret header or IP allow-list)
- [ ] Prisma migrations are clean (no squashed or pending migrations)
- [ ] `README.md` at repo root documents: setup, env vars, how to run, CRON setup

---

## 🐛 Known Issues Log

> Track any bugs or UX issues discovered during the audit here before closing this phase.

| # | Issue | File | Status |
|---|---|---|---|
| — | — | — | — |

---

## ✅ Phase Complete When

- [ ] All checklist items above are ticked
- [ ] Both `api/` and `app/` build without TypeScript errors (`tsc --noEmit`)
- [ ] All core user flows work end-to-end in a staging environment:
  - Admin creates user → user logs in → user logs transactions → streaks update → admin checks dashboard
  - Admin creates quest → user submits proof → admin approves → points awarded → notification appears
  - Admin issues bonus → bonus applied → user balance updates → notification appears

---

## 🔗 References
- Doc 1 §8 (NFRs), §7 (Image Policy)
- Doc 2 §5 (Code Constraints), §6.4 (Rate Limiting), §6.5 (Pagination)
- Doc 3 Part D (RLS), Part E (Storage Buckets)
