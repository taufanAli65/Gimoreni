# 💸 Phase 4 — Transactions (Daily Financial Records)

**Goal**: Full transaction CRUD with date-based logging, Admin summary/calendar aggregations, and streak-log side effects. This is the app's core data entry feature.

**Status**: 🔲 Not Started
**Depends on**: Phase 3

---

## Scope

Backend `transactions` domain (all 5 layers) + frontend User Add Page and Admin Calendar data feed. Every time a transaction is created, the `StreakLog` for that day must be updated (pre-wiring for Phase 6).

---

## 📁 Backend Files (`api/src/domains/transactions/`)

| File | Responsibility |
|---|---|
| `transactions.router.ts` | All `/transactions` routes with auth guards |
| `transactions.controller.ts` | HTTP layer; extract `userId` from `req.user` for USER role |
| `transactions.service.ts` | Business logic: ownership check, streak-log upsert on create |
| `transactions.repository.ts` | Prisma CRUD + `summary` aggregation + `calendar` presence query |
| `transactions.dto.ts` | Zod: `CreateTransactionDto`, `UpdateTransactionDto`, `TransactionFilterDto` |

**Side effect on `POST /transactions`:**
```
Upsert StreakLog { userId, date } → set didLog = true
```
This pre-populates streak data for Phase 6.

---

## 📁 Frontend Files (`app/src/domains/transactions/`)

| File | Responsibility |
|---|---|
| `hooks/useTransactions.ts` | `useQuery` for list with filter params |
| `hooks/useTransactionMutations.ts` | create / update / delete mutations |
| `hooks/useTransactionSummary.ts` | Admin: aggregated summary query |
| `hooks/useTransactionCalendar.ts` | Admin: calendar presence data |
| `types.ts` | `Transaction`, `TransactionType`, `TransactionSummary` interfaces |
| `components/TransactionForm.tsx` | Controlled form: type, amount, category, date, description |
| `components/TransactionList.tsx` | Scrollable list of transaction items |
| `components/TransactionItem.tsx` | Single row: icon, amount, category badge, date |
| `components/ReceiptUpload.tsx` | Optional receipt image upload (uses `compressImage()`) |

**Pages:**
- `app/src/pages/user/AddPage.tsx` — User's primary data-entry screen
- `app/src/pages/admin/CalendarPage.tsx` — receives calendar data from this domain

---

## 🔑 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/transactions` | Authenticated | Own list; Admin can `?userId=` filter |
| `GET` | `/api/v1/transactions/:id` | Authenticated | Single (ownership enforced for USER) |
| `POST` | `/api/v1/transactions` | Authenticated | Create; side-effect: upsert StreakLog |
| `PATCH` | `/api/v1/transactions/:id` | Authenticated | Update own only (USER); Admin: any |
| `DELETE` | `/api/v1/transactions/:id` | Authenticated | Delete own only (USER); Admin: any |
| `GET` | `/api/v1/transactions/summary` | ADMIN | Aggregated per-user per-month stats |
| `GET` | `/api/v1/transactions/calendar` | ADMIN | Daily presence map for calendar view |

**Query params for `GET /transactions`:**
```
?userId=    (Admin only)
?startDate=YYYY-MM-DD
?endDate=YYYY-MM-DD
?type=INCOME|EXPENSE
?categoryId=
?page=&limit=
```

**`/transactions/summary` response shape:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "...",
      "userName": "...",
      "month": 8,
      "year": 2026,
      "totalIncome": 500000,
      "totalExpense": 320000,
      "missedDays": 2
    }
  ]
}
```

---

## ✅ Acceptance Criteria

- [ ] `POST /transactions` creates the record AND upserts `StreakLog.didLog = true`
- [ ] USER cannot `GET /transactions?userId=<other>` (403)
- [ ] `GET /transactions/summary` aggregates income/expense correctly per user per month
- [ ] Receipt image upload uses `compressImage()` (≤ 500 KB) and stores URL in Supabase Storage
- [ ] Date field stored as UTC Date (no time component); displayed in local timezone on frontend
- [ ] Admin Calendar page marks days with at least one transaction as "active"
- [ ] Pagination works correctly on list endpoints
- [ ] RLS policies prevent cross-user data access

---

## 🔗 References
- Doc 1 §4.1 (Financial Records definition)
- Doc 3 Part C → Transactions endpoints, Part D → transactions RLS policies
- Doc 1 §7 (Image handling policy)
