# 🔔 Phase 7 — Notification System

**Goal**: Build the full notification pipeline: backend CRUD, frontend notification bell, and the custom interactive notification component for action-required alerts.

**Status**: 🔲 Not Started
**Depends on**: Phase 6 (notifications are created by bonuses, streaks, quest approvals)

---

## Scope

Backend `notifications` domain (all 5 layers) + frontend `NotificationBell` + `InteractiveNotification` component. Both toast and interactive notification types are handled.

---

## 📁 Backend Files (`api/src/domains/notifications/`)

| File | Responsibility |
|---|---|
| `notifications.router.ts` | List, mark-read, mark-all-read, delete |
| `notifications.controller.ts` | HTTP layer |
| `notifications.service.ts` | Business logic: ownership enforcement, bulk read |
| `notifications.repository.ts` | Prisma queries — unread-first ordering |
| `notifications.dto.ts` | (Minimal — notifications are created by the system, not by users) |

**Notification creation** is handled internally by other services (bonuses, redemptions, streaks — see Phases 5 & 6). The repository exposes a shared `createNotification()` function used by other services.

---

## 📁 Frontend Files

### Domain (`app/src/domains/notifications/`)
| File | Responsibility |
|---|---|
| `hooks/useNotifications.ts` | `useQuery` — polls or uses refetch for new notifications |
| `hooks/useNotificationMutations.ts` | mark-read / mark-all-read / delete |
| `types.ts` | `Notification`, `NotificationAction` interfaces |

### Shared Components (`app/src/shared/components/notifications/`)
| File | Responsibility |
|---|---|
| `NotificationBell.tsx` | Icon button with unread badge count (top-right on both layouts) |
| `NotificationDropdown.tsx` | Dropdown panel listing recent notifications |
| `InteractiveNotification.tsx` | Custom modal component for `requiresAction = true` notifications |
| `NotificationItem.tsx` | Single row in the dropdown |

**Two notification display modes:**

1. **Toast** (Sonner) — for transient success/error feedback (e.g., "Record saved!"). These are NOT stored in the DB; they are triggered locally on mutation success/error.

2. **Interactive Notification** (`requiresAction = true`) — stored in DB, displayed as a modal overlay requiring user acknowledgment. Example: "Your quest has been approved! +50 pts — Claim?" with a dismiss button.

---

## 🔑 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/notifications` | Authenticated | Own notifications, unread first, paginated |
| `PATCH` | `/api/v1/notifications/:id/read` | Authenticated | Mark single as read |
| `PATCH` | `/api/v1/notifications/read-all` | Authenticated | Mark all own as read |
| `DELETE` | `/api/v1/notifications/:id` | Authenticated | Delete own notification |

---

## 🔔 Notification Templates

| Trigger | Title | Body | `requiresAction` |
|---|---|---|---|
| Quest redemption approved | "Quest Approved! 🎉" | "Your quest '{title}' was approved! +{pts} points" | `true` |
| Quest redemption rejected | "Quest Rejected" | "Your quest '{title}' submission was rejected: {note}" | `false` |
| Bonus applied | "Bonus Added 💰" | "You received a bonus of Rp{amount}" | `false` |
| Streak reminder | "Log Your Finances 🌿" | "Don't forget to log today before midnight!" | `false` |

---

## ✅ Acceptance Criteria

- [ ] `GET /notifications` returns notifications in unread-first order
- [ ] `PATCH /notifications/read-all` marks ALL own notifications as read in one query
- [ ] `requiresAction = true` notifications render as an `InteractiveNotification` modal on the frontend
- [ ] `requiresAction = false` notifications render as items in the `NotificationDropdown`
- [ ] `NotificationBell` shows an unread count badge (hidden when count = 0)
- [ ] Bell is present in both `AdminLayout` and `UserLayout`
- [ ] Sonner toast fires on mutation success/error (no DB write)
- [ ] RLS: Users cannot read or modify other users' notifications

---

## 🔗 References
- Doc 1 §5.5 (Notifications)
- Doc 2 §10.1 (State management — server state via React Query)
- Doc 3 Part C → Notifications endpoints, Part D → notifications RLS
