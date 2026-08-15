# 🗺️ Gimoreni — Build Phases Overview

> **Project**: Gimoreni *(Gimme More Money)*
> **Stack**: Node.js + Express + TypeScript (API) · React + TypeScript (App) · Supabase · Prisma · Tailwind + Shadcn UI

This directory tracks the entire build plan, broken down into self-contained, sequential phases.
Each phase has its own markdown file with a detailed task checklist, acceptance criteria, and file-level scope.

---

## 📋 Phase Index

| Phase | File | Focus | Status |
|---|---|---|---|
| 0 | [phase_00_foundation.md](./phase_00_foundation.md) | Monorepo scaffold, tooling, env, Prisma, Supabase | ✅ Completed |
| 1 | [phase_01_auth.md](./phase_01_auth.md) | Authentication (JWT, login, refresh, logout, me) | ✅ Completed |
| 2 | [phase_02_users.md](./phase_02_users.md) | User Management CRUD + balance management | ✅ Completed |
| 3 | [phase_03_categories.md](./phase_03_categories.md) | Category Management (visibility logic) | ✅ Completed |
| 4 | [phase_04_transactions.md](./phase_04_transactions.md) | Daily Financial Records CRUD + summary/calendar | ✅ Completed |
| 5 | [phase_05_quests.md](./phase_05_quests.md) | Quest Management CRUD + Redemption flow | ✅ Completed |
| 6 | [phase_06_bonuses_streaks.md](./phase_06_bonuses_streaks.md) | Bonus Management + Streak tracking + CRON logic | ✅ Completed |
| 7 | [phase_07_notifications.md](./phase_07_notifications.md) | Notification system (in-app, interactive) | ✅ Completed |
| 8 | [phase_08_admin_ui.md](./phase_08_admin_ui.md) | Admin UI (Dashboard, Calendar, Quests, Users, Misc) | 🔲 Not Started |
| 9 | [phase_09_user_ui.md](./phase_09_user_ui.md) | User UI (Home, Add, Settings, Tutorial) | 🔲 Not Started |
| 10 | [phase_10_polish_and_nfr.md](./phase_10_polish_and_nfr.md) | Polish, NFRs, RLS audit, image policy, rate limiting | 🔲 Not Started |

---

## 🔑 Global Constraints (carry through every phase)

- **≤ 300 lines per file** — non-negotiable; refactor immediately
- **No `any` types** without an explicit justification comment
- **DDD layer discipline**: Controller → Service → Repository (never skip layers)
- **Standard response envelope** on every API endpoint
- **`compressImage()`** before every file upload on the client
- **UTC timestamps** everywhere; convert to local time on the frontend only
- **RLS policies** required on every new Supabase table
- **Color palette**: Forest Green `#2D6A4F` · Deep Brown `#6B4226` · Off-White `#F5F5F0` · Moss Green `#52B788` · Warm Beige `#D9BF9E`
- **Single font**: Inter or Geist only · No gradients · Flat colors + subtle shadows
