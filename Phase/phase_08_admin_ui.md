# 🖥️ Phase 8 — Admin UI (Desktop-First)

**Goal**: Build all Admin-facing pages to a polished, desktop-first standard. All backend data is already available via API (Phases 1–7). This phase focuses entirely on UI assembly, layout, and UX.

**Status**: ✅ Completed
**Depends on**: Phase 7

---

## Scope

All five Admin pages wired to live APIs: Dashboard, Calendar, Quests, Users, and Misc. Admin Layout with sidebar navigation and notification bell.

---

## 📁 Files to Build / Complete

### Layout
- `app/src/shared/components/layout/AdminLayout.tsx`
  - Sidebar navigation (Forest Green background, Off-White text)
  - Active route highlighting
  - `NotificationBell` in top-right header
  - Responsive: collapses to hamburger on mobile

### Pages (`app/src/pages/admin/`)

#### `DashboardPage.tsx`
- Summary cards: total users, total transactions this month, total pending redemptions
- Per-user summary table: name, this month income/expense, missed days, balance, allowance
- Data source: `GET /transactions/summary`

#### `CalendarPage.tsx`
- Google Calendar-style month grid
- Days with transactions are marked "active" (Moss Green dot)
- Click a day → slide-in panel or modal with that day's transaction list
- Filter by user: `<select>` to switch between users
- Data source: `GET /transactions/calendar` + `GET /transactions?userId=&startDate=&endDate=`

#### `QuestsPage.tsx`
- Two sections: Quest List + Pending Redemptions
- Quest List: table with title, points, status, deadline, action buttons (publish, edit, delete)
- Pending Redemptions: cards showing user name, quest name, proof image (lightbox), note, approve/reject buttons
- Inline DRAFT → ACTIVE publish button

#### `UsersPage.tsx`
- Table: avatar, name, email, role badge, balance, allowance, streak, status (active/inactive)
- Actions: Edit (modal), Soft-delete (confirm dialog), Adjust Balance (inline number input)
- Create User button → modal form

#### `MiscPage.tsx`
- Three sections (tabs or stacked):
  1. **Bonus Management**: list of bonuses per user, create/edit/delete/apply
  2. **Category Management**: list of all categories (including ADMIN_ONLY), create/edit/delete, visibility selector
  3. **App Settings**: reserved for future use (placeholder section)

---

## 🎨 Admin UI Design Rules

- **Layout**: Fixed left sidebar (240px) + scrollable main content area
- **Sidebar color**: Forest Green `#2D6A4F` · text: Off-White `#F5F5F0`
- **Content background**: Off-White `#F5F5F0`
- **Card/panel background**: white with `shadow-sm`
- **Primary action buttons**: Forest Green `#2D6A4F` · hover: `#52B788` (Moss Green)
- **Danger buttons**: Deep Brown `#6B4226`
- **Badges**: Moss Green for ACTIVE/APPROVED, Warm Beige for PENDING, Deep Brown for REJECTED/EXPIRED
- **Font**: Inter · Sizes: h1 = 24px, body = 14px, caption = 12px
- **No gradients** — flat backgrounds and `shadow-sm` only

---

## 🧩 Reusable Shared Components to Build

| Component | Purpose |
|---|---|
| `DataTable.tsx` | Generic sortable/filterable table (used in Users, Quests, Bonuses pages) |
| `ConfirmDialog.tsx` | Reusable "Are you sure?" modal |
| `StatCard.tsx` | Dashboard summary card (icon + label + value) |
| `StatusBadge.tsx` | Color-coded pill badge for enum statuses |
| `UserAvatar.tsx` | Circular avatar with fallback initials |
| `PageHeader.tsx` | Title + subtitle + optional action button area |

---

## ✅ Acceptance Criteria

- [ ] All five admin pages load without errors and display real API data
- [ ] Dashboard shows correct per-user monthly summary
- [ ] Calendar correctly marks days with transactions (per selected user)
- [ ] Admin can publish a quest and see it move from DRAFT to ACTIVE
- [ ] Admin can approve/reject a redemption and see the status update in real-time (React Query invalidation)
- [ ] Creating a user from UsersPage creates both Supabase Auth + Prisma records
- [ ] Admin can apply a bonus and the user's balance updates
- [ ] All pages are responsive (sidebar collapses on mobile)
- [ ] Notification bell shows unread count and dropdown

---

## 🔗 References
- Doc 1 §6 (Page Map — Admin), §5.3 (Responsive Strategy), §5.2 (UI Rules)
- Doc 2 §10.1 (Server state via React Query)
