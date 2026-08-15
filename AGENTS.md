# 🤖 Agent Instructions — Gimoreni Project

> These instructions are **mandatory** and must be followed without exception for every task in this repository.

---

## 📚 Source of Truth

This project is governed by **three foundational documents** in the `docs/` directory.
Before writing any code, planning any feature, or making any architectural decision,
you **MUST** read and internalize all three documents:

| # | File | Contents |
|---|---|---|
| 1 | [`docs/01_general_project_document.md`](./docs/01_general_project_document.md) | Project overview, roles, game mechanics, UI/UX rules, page map, NFRs |
| 2 | [`docs/02_conventions_and_architecture.md`](./docs/02_conventions_and_architecture.md) | Tech stack, monorepo structure, DDD conventions, naming, API patterns, auth |
| 3 | [`docs/03_api_spec_and_erd.md`](./docs/03_api_spec_and_erd.md) | Full Prisma schema (ERD), API endpoint specification, RLS policies, Storage buckets |

---

## ⚡ Mandatory Behavior

### 1. Always Read the Docs First
Before starting **any** task — feature, fix, refactor, or scaffolding — read the relevant sections of the three documents above. Do not rely on memory or assumptions.

### 2. Enforce the Tech Stack (Doc 2, §1)
- **Backend**: Node.js + Express.js + TypeScript (strict) in `api/`
- **Frontend**: React.js + TypeScript (strict) in `app/`
- **Styling**: Tailwind CSS + Shadcn UI — no other CSS frameworks
- **ORM**: Prisma (schema at `api/prisma/schema.prisma`)
- **Database**: Supabase (PostgreSQL)
- **State (server)**: React Query (`@tanstack/react-query`)
- **Env validation**: Zod in `api/src/config/env.ts`

### 3. Enforce Domain-Driven Design (Doc 2, §3)
- Every backend domain lives in `api/src/domains/<domain>/` with exactly these files:
  `*.router.ts`, `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.dto.ts`
- Every frontend domain lives in `app/src/domains/<domain>/` with:
  `hooks/`, `pages/`, `components/`, `types.ts`
- **Controllers NEVER call Prisma directly** — only through the service.
- **Services NEVER touch `req`/`res`** — pure business logic only.
- **Repositories are the ONLY place Prisma queries live.**

### 4. Enforce Hard Code Constraints (Doc 2, §5)
- **≤ 300 lines per file** — non-negotiable. Refactor immediately if exceeded.
- **No `any` types** in TypeScript without an explicit justification comment.
- All variables, functions, components, and files follow the naming conventions in Doc 2, §4.

### 5. Enforce API Conventions (Doc 2, §6)
- Base URL: `/api/v1`
- All responses use the standard envelope: `{ success, data, meta? }` or `{ success, error }`.
- All list endpoints support `?page=&limit=` pagination.
- Rate limiting is applied globally as the **first middleware** in `app.ts`.

### 6. Enforce Authentication Rules (Doc 2, §7)
- Access token: short-lived JWT in `Authorization: Bearer <token>` header.
- Refresh token: long-lived in `HttpOnly` cookie.
- Every protected route uses `authenticate` middleware, optionally followed by `requireRole('ADMIN')`.

### 7. Enforce the Prisma Schema (Doc 3, Part A)
- Do **not** invent new models or fields without referencing the canonical schema in Doc 3.
- All new Prisma fields must use `snake_case` column names via `@map()`.
- All DB timestamps must be stored in **UTC**.

### 8. Enforce RLS Policies (Doc 3, Part D)
- Every new table created in Supabase must have RLS enabled and matching policies.
- Reference the existing SQL policies in Doc 3, Part D as the pattern.

### 9. Enforce Image Handling Policy (Doc 1, §7)
- All image uploads **must** go through `compressImage()` (client-side, `browser-image-compression`) before any upload API call. Never skip this.
- Max output size: **≤ 500 KB**.

### 10. Enforce UI/UX Rules (Doc 1, §5)
- Color palette: Forest Green `#2D6A4F`, Deep Brown `#6B4226`, Off-White `#F5F5F0`, Moss Green `#52B788`, Warm Beige `#D9BF9E`.
- **No unnecessary gradients** — flat colors and subtle shadows only.
- **Single font family** — Inter or Geist only.
- Admin = Desktop-first, responsive. User = Mobile-first.

---

## 🚫 Hard Rules (Never Violate)

| Rule | Reason |
|---|---|
| Never call Prisma from a Controller | Violates DDD layering |
| Never put HTTP objects in a Service | Violates DDD layering |
| Never skip `compressImage()` before upload | Image handling policy |
| Never use `any` without a comment | TypeScript strict mode |
| Never exceed 300 lines in a file | Maintainability constraint |
| Never create a new API endpoint without a matching response envelope | API convention |
| Never enable a Supabase table without RLS policies | Security requirement |
| Never store timestamps in non-UTC | Timezone policy |

---

## 🗂️ Directory Quick Reference

```
gimoreni/
├── api/                    # Express.js backend
│   ├── prisma/schema.prisma
│   └── src/
│       ├── domains/        # One folder per domain (DDD)
│       ├── shared/         # Middleware, utils, types, constants
│       └── config/         # env.ts (Zod), supabase.ts
├── app/                    # React.js frontend
│   └── src/
│       ├── domains/        # Mirrored frontend DDD domains
│       ├── shared/         # UI components, hooks, lib, types
│       ├── pages/          # Assembled page components
│       └── router/         # AppRouter, AdminRoutes, UserRoutes
├── docs/                   # ← SOURCE OF TRUTH (read before coding)
│   ├── 01_general_project_document.md
│   ├── 02_conventions_and_architecture.md
│   └── 03_api_spec_and_erd.md
├── Phase/                  # ← BUILD PLAN (consult before starting work)
│   ├── README.md           # Phase index + global constraints
│   ├── phase_00_foundation.md
│   ├── phase_01_auth.md
│   ├── phase_02_users.md
│   ├── phase_03_categories.md
│   ├── phase_04_transactions.md
│   ├── phase_05_quests.md
│   ├── phase_06_bonuses_streaks.md
│   ├── phase_07_notifications.md
│   ├── phase_08_admin_ui.md
│   ├── phase_09_user_ui.md
│   └── phase_10_polish_and_nfr.md
└── shared-types/           # (Optional) shared TS interfaces
```

---

## ✅ Pre-Task Checklist

Before writing any code, confirm:
- [ ] I have read the relevant sections of `docs/01_general_project_document.md`
- [ ] I have read the relevant sections of `docs/02_conventions_and_architecture.md`
- [ ] I have read the relevant sections of `docs/03_api_spec_and_erd.md`
- [ ] I have read the relevant phase file in `Phase/` for the current work scope
- [ ] My implementation follows the DDD folder/layer structure
- [ ] My file will not exceed 300 lines
- [ ] No `any` types are used without justification
- [ ] API responses use the standard envelope
- [ ] Images go through `compressImage()` before upload
- [ ] New Supabase tables have RLS enabled and policies defined
