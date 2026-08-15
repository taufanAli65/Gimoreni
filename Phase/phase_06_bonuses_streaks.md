# 🔥 Phase 6 — Bonuses & Streaks

**Goal**: Implement the Bonus Management system (Admin-issued monetary rewards) and the full Streak evaluation logic including daily CRON-triggered checks, streak resets, and milestone tracking.

**Status**: 🔲 Not Started
**Depends on**: Phase 5 (StreakLog is pre-populated by transactions in Phase 4)

---

## Scope

Backend `bonuses` domain + `streaks` domain. CRON endpoints for streak checking and daily reminders. Admin Misc page bonus section. Streak display on User Home.

---

## 📁 Backend — Bonuses Domain (`api/src/domains/bonuses/`)

| File | Responsibility |
|---|---|
| `bonuses.router.ts` | All `/bonuses` routes (ADMIN only) + `/:id/apply` |
| `bonuses.controller.ts` | HTTP layer |
| `bonuses.service.ts` | Business logic: prevent applying already-applied bonus, calc deduction |
| `bonuses.repository.ts` | Prisma queries; check for duplicate monthly bonus |
| `bonuses.dto.ts` | Zod: `CreateBonusDto`, `UpdateBonusDto` |

**Bonus types:**
- `MONTHLY_COMPLETION` — triggered when Admin confirms a perfect month
- `STREAK_MILESTONE` — triggered by streak thresholds (configurable in a future phase)
- `MANUAL` — Admin-issued ad hoc bonus

**Apply side effect** (`POST /bonuses/:id/apply`):
1. `User.balance += Bonus.amount`
2. `User.totalPoints += Bonus.pointsBonus` (if any)
3. `Bonus.isApplied = true`
4. Create `Notification` for User

---

## 📁 Backend — Streaks Domain (`api/src/domains/streaks/`)

| File | Responsibility |
|---|---|
| `streaks.router.ts` | `/streaks/me`, `/streaks/:userId`, `/streaks/check`, `/streaks/remind` |
| `streaks.controller.ts` | HTTP layer |
| `streaks.service.ts` | Streak evaluation algorithm; reminder notification logic |
| `streaks.repository.ts` | Query `StreakLog`, upsert, bulk read for CRON |
| `streaks.dto.ts` | (Minimal — CRON endpoints have no body) |

**Streak Evaluation Algorithm** (called by `/streaks/check`):
```
For each active User:
  1. Query StreakLog for today's date (already set by transaction creation in Phase 4)
  2. If didLog = true:
       currentStreak += 1
       longestStreak = max(longestStreak, currentStreak)
       lastLoggedDate = today
  3. If didLog = false AND it is past 23:00 UTC:
       currentStreak = 0
  4. Upsert StreakLog entry for today
  5. Persist changes to User model
```

**Reminder Logic** (called by `/streaks/remind`):
```
Find all active Users where:
  lastLoggedDate < today (they haven't logged yet today)
Create a Notification for each: "Don't forget to log your finances today! 🌿"
```

---

## 📁 Frontend Files

### Bonuses (`app/src/domains/bonuses/`)
| File | Responsibility |
|---|---|
| `hooks/useBonuses.ts` | Admin: list + single |
| `hooks/useBonusMutations.ts` | Admin: create / update / delete / apply |
| `types.ts` | `Bonus`, `BonusType` interfaces |
| `components/BonusForm.tsx` | Create/edit form — type, amount, pointsBonus, description |
| `components/BonusCard.tsx` | Display a bonus record with apply button |

### Streaks (`app/src/domains/streaks/`)
| File | Responsibility |
|---|---|
| `hooks/useMyStreak.ts` | USER: fetch own streak data |
| `hooks/useUserStreak.ts` | ADMIN: fetch any user's streak |
| `types.ts` | `StreakData` interface |
| `components/StreakCounter.tsx` | Flame icon + current streak number for User Home |
| `components/StreakCalendar.tsx` | Mini month calendar showing logged vs missed days |

**Pages:**
- Bonus section embedded in `app/src/pages/admin/MiscPage.tsx`
- Streak widget embedded in `app/src/pages/user/HomePage.tsx`

---

## 🔑 API Endpoints

### Bonuses
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/bonuses` | ADMIN | List all; filter `?userId=&type=` |
| `GET` | `/api/v1/bonuses/:id` | ADMIN | Single bonus |
| `POST` | `/api/v1/bonuses` | ADMIN | Create bonus record |
| `PATCH` | `/api/v1/bonuses/:id` | ADMIN | Update (only if `isApplied = false`) |
| `DELETE` | `/api/v1/bonuses/:id` | ADMIN | Delete (only if `isApplied = false`) |
| `POST` | `/api/v1/bonuses/:id/apply` | ADMIN | Apply bonus to user's balance |

### Streaks
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/streaks/me` | USER | Own streak data |
| `GET` | `/api/v1/streaks/:userId` | ADMIN | Any user's streak data |
| `POST` | `/api/v1/streaks/check` | System/CRON | Run daily streak evaluation for all users |
| `POST` | `/api/v1/streaks/remind` | System/CRON | Create reminder notifications for users who haven't logged |

---

## ✅ Acceptance Criteria

- [ ] Creating a bonus with `isApplied = true` is not allowed via API
- [ ] Applying a bonus correctly increments `User.balance` and `User.totalPoints`
- [ ] Applying an already-applied bonus returns `409 Conflict`
- [ ] `/streaks/check` correctly increments streak for users with `didLog = true`
- [ ] `/streaks/check` resets `currentStreak = 0` for users with `didLog = false` past 23:00 UTC
- [ ] `longestStreak` is only updated when current streak exceeds it
- [ ] `/streaks/remind` creates one notification per user who hasn't logged today
- [ ] Streak counter displays with flame icon on User Home
- [ ] Bonus section in Admin Misc page shows all bonuses with apply button

---

## 🔗 References
- Doc 1 §4.2 (Bonus & Deduction), §4.3 (Streak System)
- Doc 3 Part C → Bonuses + Streaks endpoints, Part D → bonuses/streak_logs RLS
