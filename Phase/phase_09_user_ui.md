# 📱 Phase 9 — User UI (Mobile-First)

**Goal**: Build all User-facing pages to a polished, mobile-first standard with gamification elements front and center: streaks, points, quests, and the first-login tutorial.

**Status**: 🔲 Not Started
**Depends on**: Phase 7 (all data layers ready)

---

## Scope

Three user pages (Home, Add, Settings) + the onboarding Tutorial modal. User Layout with bottom navigation. All pages wired to live APIs.

---

## 📁 Files to Build / Complete

### Layout
- `app/src/shared/components/layout/UserLayout.tsx`
  - Mobile-first full-height layout
  - Bottom tab navigation: Home · Add · Settings
  - `NotificationBell` in top-right header (within page header bar)
  - Tutorial trigger logic: if `!user.hasCompletedTutorial`, open `TutorialModal`

### Pages (`app/src/pages/user/`)

#### `HomePage.tsx`
- **Header bar**: App logo + notification bell
- **Streak Widget** (`StreakCounter.tsx`): flame icon + current streak count + "days in a row"
- **Points Display**: total points (large number, Moss Green accent)
- **Expense Chart** (`ExpenseChart.tsx`): doughnut/pie chart of expenses per category for current month; uses data from `GET /transactions?type=EXPENSE&startDate=&endDate=`
- **Quest Widget** (`QuestCard.tsx`): active quest card — title, points, deadline, submit proof button; if no active quest, shows "No active quests" with a list of available ACTIVE quests
- **Balance & Allowance**: small card showing current balance and monthly allowance

#### `AddPage.tsx`
- **Tab bar**: Income / Expense toggle
- **Date picker**: defaults to today, can select past dates
- **Amount input**: large, numeric keyboard-optimized
- **Category selector**: scrollable chip/pill list (role-filtered categories)
- **Description input**: optional text field
- **Receipt upload**: optional image picker → `compressImage()` → upload to Supabase Storage
- **Transaction list**: below the form, today's transactions (editable by tapping)
- Edit/Delete inline on each transaction item

#### `SettingsPage.tsx`
- **Profile section**: avatar (upload via `compressImage()`), name (editable)
- **Account info**: email (read-only), role (read-only)
- **Streak info**: current streak, longest streak, last logged date
- **Bonus history**: list of past bonuses/deductions applied
- **Logout button**

### Tutorial Modal (`app/src/shared/components/`)
- `TutorialModal.tsx` — step-by-step overlay (5 steps, see Doc 1 §5.4)
  1. How to log a daily record
  2. How to view stats and quests on Home
  3. How the Bonus/Deduction system works
  4. How to submit a Quest Redemption
  5. What Streaks are and why they matter
- Has a "Next" button and a "Skip tutorial" link
- On completion: calls `PATCH /users/me { hasCompletedTutorial: true }`
- Only shown once per user (tracked via `hasCompletedTutorial` flag)

---

## 🎨 User UI Design Rules

- **Mobile-first**: designed for 375px wide screens, all touch targets ≥ 44×44px
- **Background**: Off-White `#F5F5F0`
- **Bottom nav**: Forest Green `#2D6A4F` background · active icon: Moss Green `#52B788`
- **Primary CTA buttons**: Forest Green `#2D6A4F`, full-width, rounded-lg
- **Accent / highlights**: Moss Green `#52B788` for streaks, points, active states
- **Cards**: white background, `rounded-xl`, `shadow-sm`
- **Streak flame**: animated pulse on current streak counter (subtle CSS animation)
- **Points counter**: large font, Moss Green color — this is the user's "score"
- **No gradients** — flat colors only
- **Font**: Inter · Body = 16px · h1 = 24px · caption = 12px

---

## 🧩 Reusable User Components

| Component | Purpose |
|---|---|
| `StreakCounter.tsx` | Flame + number display |
| `ExpenseChart.tsx` | Recharts/Chart.js doughnut per category |
| `BottomNav.tsx` | Tab bar with icons |
| `AmountInput.tsx` | Large numeric input with currency formatting |
| `CategoryChips.tsx` | Horizontal scrollable chip selector |
| `TransactionItem.tsx` | Swipeable row for transaction list |
| `TutorialModal.tsx` | 5-step onboarding overlay |

---

## ✅ Acceptance Criteria

- [ ] Home page loads streak, points, expense chart, and quest widget from live API
- [ ] Expense chart correctly shows current month's expenses grouped by category
- [ ] Add page creates a transaction and immediately shows it in today's list (React Query invalidation)
- [ ] Receipt image is compressed (≤ 500 KB) before upload
- [ ] Tutorial modal appears on first login only
- [ ] Completing tutorial calls `PATCH /users/me` and modal never shows again
- [ ] Skipping tutorial also marks `hasCompletedTutorial = true`
- [ ] Settings page allows name + avatar update
- [ ] All touch targets are ≥ 44×44px
- [ ] Bottom nav highlights the active route
- [ ] Notification bell shows unread count

---

## 🔗 References
- Doc 1 §5.3 (Responsive — User = Mobile-first), §5.4 (Tutorial), §6 (Page Map — User), §7 (Image Policy)
- Doc 2 §10.5 (Tutorial trigger logic)
