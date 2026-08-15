# 📄 Document 1: General Project Document
## Gimoreni — *Gimme More Money*

---

## 1. Overview

| Field | Value |
|---|---|
| **Application Name** | Gimoreni *(Gimme More Money)* |
| **Tagline** | Track smarter. Earn more. |
| **Type** | Gamified Financial Tracking Web Application |
| **Primary Audience** | Admin (Elder sibling) & User (Younger sibling) |
| **Version** | 1.0.0 |
| **Status** | In Development |

---

## 2. Purpose & Problem Statement

Gimoreni is a **gamified monthly allowance tracking system** designed to enforce financial discipline in a younger sibling through behavioral incentives tied directly to their allowance:

- ✅ **Reward**: Completing full monthly financial reports yields a **bonus** on top of the base allowance.
- ❌ **Penalty**: Incomplete reports result in a **deduction** from the allowance.

The app turns what could be a nagging household obligation into an engaging, points-driven experience — complete with quests, streaks, and a visual reward system.

---

## 3. User Roles & Permissions Matrix

| Feature | Admin | User |
|---|---|---|
| Login | ✅ | ✅ |
| View own financial records | ✅ | ✅ |
| Add / Edit / Delete own daily records | ✅ | ✅ |
| View all users' financial records | ✅ | ❌ |
| Add / manage allowance & balance | ✅ | ❌ |
| User Management (CRUD) | ✅ | ❌ |
| Bonus Management (CRUD) | ✅ | ❌ |
| Quest Management (CRUD) | ✅ | ❌ |
| Confirm Quest Redemptions | ✅ | ❌ |
| Submit Quest Redemption (with proof) | ❌ | ✅ |
| Manage Expense Categories | ✅ | ✅ |
| View `ADMIN_ONLY` categories | ✅ | ❌ |
| View `USER_ONLY` categories | ❌ | ✅ |
| View `ALL` categories | ✅ | ✅ |
| View Dashboard (all users' summary) | ✅ | ❌ |
| View Calendar (all users' history) | ✅ | ❌ |
| View Home (own chart, points, quests) | ❌ | ✅ |
| Receive daily streak reminders | ✅ | ✅ |

---

## 4. Core Concepts & Game Mechanics

### 4.1 Financial Records
Each **day**, the User logs their income and expenses. A **complete** day is defined as having at least one record submitted. A **complete month** is defined as having no missed days within the calendar month.

### 4.2 Bonus & Deduction System
- If the month closes with **0 missed days** → Admin can trigger a **Bonus** (configured via Bonus Management).
- If the month closes with **≥ 1 missed days** → The system flags an allowance **Deduction** (amount configurable per Admin).
- Only the **Admin** can disburse or adjust allowance/balance amounts.

### 4.3 Streak System
- A **daily streak** tracks consecutive days of financial logging.
- Streaks are reset if a day is missed (no records submitted before midnight).
- The system sends **daily reminders** (push notification / in-app) to log finances before the day ends.
- Streak milestones may unlock bonus points or be referenced in Quest conditions.

### 4.4 Quest System
Quests are short-term challenges the Admin creates to keep the User engaged:
- Each Quest has a **point reward**, **description**, **deadline**, and **proof requirement**.
- The User **submits proof** (image, text) to redeem a quest.
- The Admin **reviews and confirms** the submission.
- Upon confirmation, **points are awarded** to the User's profile.
- An **active quest** is one the User has accepted but not yet redeemed.

### 4.5 Points System
Points accumulate on the User's profile from:
- Confirmed Quest Redemptions
- Streak milestones (optional, configurable)
- Future extensibility (e.g., perfect-month bonus points)

Points are displayed prominently on the User's Home Page as a key gamification hook.

---

## 5. UI/UX Design Principles

### 5.1 Theme
| Attribute | Specification |
|---|---|
| **Theme Name** | Forest |
| **Primary Colors** | Forest Green (`#2D6A4F`), Deep Brown (`#6B4226`), Off-White (`#F5F5F0`) |
| **Accent** | Moss Green (`#52B788`), Warm Beige (`#D9BF9E`) |
| **Vibe** | Clean, modern gamification — think productivity app meets RPG |

### 5.2 Strict Rules
- 🚫 **NO** unnecessary gradients. Use flat colors and subtle shadows.
- 🚫 **NO** multiple font families. A single font stack (e.g., Inter or Geist) is the only allowed typography.
- ✅ Minimal, purposeful animations (e.g., progress bars, streak counters).
- ✅ Gamification elements (XP bars, badges, streak flames) should feel native, not forced.

### 5.3 Responsive Strategy
| Role | Primary View | Adaptive View |
|---|---|---|
| Admin | Desktop Web | Mobile (responsive) |
| User | Mobile | — |

### 5.4 First-Time User Tutorial
Upon the **User's first successful login**, a **step-by-step tutorial pop-up** (modal overlay) is displayed, guiding them through:
1. How to log a daily financial record (Add Page).
2. How to view their stats and active quests (Home Page).
3. How the Bonus/Deduction system works.
4. How to submit a Quest Redemption.
5. What Streaks are and why they matter.

This tutorial is only shown once, tracked via a `hasCompletedTutorial` flag on the User profile.

### 5.5 Notifications
- **Toast Notifications**: Used for transient, non-blocking feedback (e.g., "Record saved!", "Login successful").
- **Custom Interactive Notification Component**: A purpose-built component (not a third-party modal) for alerts requiring user action (e.g., "Quest X has been confirmed — Claim your points?", "You have a pending deduction — Review").

---

## 6. Page Map

### User View (Mobile-First)

```
/                   → Home Page
  - Expense chart (per category)
  - Total accumulated points
  - Active Quest widget (or available quests list)
  - Notifications icon (top-right)

/add                → Add / Edit / Delete Daily Financial Record

/settings           → Settings Page
```

### Admin View (Web Dashboard)

```
/admin              → Dashboard Home
  - Financial summary per user

/admin/calendar     → Calendar View (Google Calendar-style)
  - Click a date → Daily history detail modal

/admin/quests       → Quest Management (CRUD)

/admin/users        → User Management (CRUD)

/admin/misc         → Miscellaneous (Lain-Lain) Page
  - Bonus Management
  - Category Management
  - App-level settings
```

---

## 7. Image Handling Policy

> [!IMPORTANT]
> **All image uploads from the client MUST undergo client-side compression before being transmitted to the backend.**

- Use a library such as `browser-image-compression` on the frontend.
- Maximum output size: **≤ 500 KB** per image before upload.
- Accepted formats: `image/jpeg`, `image/png`, `image/webp`.
- Applies to: Quest Redemption proof images, User avatar uploads.
- Backend should still validate MIME type and file size as a secondary safety layer.

---

## 8. Key Non-Functional Requirements

| Requirement | Detail |
|---|---|
| **Rate Limiting** | All API endpoints must enforce rate limiting (global middleware). |
| **Pagination** | All list/fetch endpoints must support cursor-based or offset pagination. |
| **Authentication** | JWT-based, with tokens stored securely (HttpOnly cookie or secure storage). |
| **Type Safety** | 100% TypeScript — no `any` types unless absolutely justified with a comment. |
| **File Size** | Strictly **≤ 300 lines** per file. Refactor into modules if exceeded. |
| **RLS** | Supabase Row Level Security must enforce role-based data access at the DB layer. |
| **Timezone** | All timestamps stored in UTC. Display in user's local timezone on the frontend. |

---
