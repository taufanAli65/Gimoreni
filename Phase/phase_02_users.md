# 👥 Phase 2 — User Management

**Goal**: Full CRUD for users (Admin only) + self-profile update + balance/allowance management.

**Status**: 🔲 Not Started
**Depends on**: Phase 1

---

## Scope

Backend `users` domain (all 5 layers) + minimal frontend stubs for the Admin Users page. The Admin can list, create, update, soft-delete users, and directly adjust balances.

---

## 📁 Backend Files (`api/src/domains/users/`)

| File | Responsibility |
|---|---|
| `users.router.ts` | All `/users` routes with `authenticate` + `requireRole` guards |
| `users.controller.ts` | HTTP layer — parse params/body, call service, return envelope |
| `users.service.ts` | Business logic: soft-delete guard, balance mutation rules |
| `users.repository.ts` | All Prisma queries for `User` model |
| `users.dto.ts` | Zod: `CreateUserDto`, `UpdateUserDto`, `UpdateBalanceDto`, `UpdateMeDto` |

---

## 📁 Frontend Files (`app/src/domains/users/`)

| File | Responsibility |
|---|---|
| `hooks/useUsers.ts` | `useQuery` for list + `useMutation` for create/update/delete |
| `hooks/useUser.ts` | `useQuery` for single user detail |
| `hooks/useUpdateMe.ts` | Mutation for `PATCH /users/me` |
| `types.ts` | `User`, `UserRole`, `UpdateMePayload` interfaces |

**Pages** (in `app/src/pages/admin/`):
- `UsersPage.tsx` — table of all users with action buttons

---

## 🔑 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/users` | ADMIN | List all users, paginated |
| `GET` | `/api/v1/users/:id` | ADMIN | Single user profile + stats |
| `POST` | `/api/v1/users` | ADMIN | Create user (via Supabase Auth + Prisma) |
| `PATCH` | `/api/v1/users/:id` | ADMIN | Update name, role, allowance, balance |
| `DELETE` | `/api/v1/users/:id` | ADMIN | Soft-delete: `isActive = false` |
| `PATCH` | `/api/v1/users/me` | Authenticated | Update own `name`, `avatarUrl`, `hasCompletedTutorial` |
| `PATCH` | `/api/v1/users/:id/balance` | ADMIN | Adjust balance or allowance directly |

**Create User side effects:**
1. Create user in Supabase Auth (via service_role admin SDK).
2. Create matching `User` record in Prisma with `supabaseUserId`.

**Soft-delete guard:**
- Cannot delete own account.
- Cannot delete the last ADMIN.

---

## ✅ Acceptance Criteria

- [ ] `GET /users` returns paginated list with `meta`
- [ ] `POST /users` creates Supabase Auth user AND Prisma `User` in one transaction
- [ ] `DELETE /users/:id` sets `isActive = false`, does not hard-delete
- [ ] `PATCH /users/me` only allows updating `name`, `avatarUrl`, `hasCompletedTutorial` (no role/balance changes)
- [ ] `PATCH /users/:id/balance` validates that amount is a positive number
- [ ] RLS: Users cannot read other users' rows via direct DB access
- [ ] Admin Users page renders a table with name, email, role, balance, allowance, status
- [ ] Avatar uploads go through `compressImage()` before `PATCH /users/me`

---

## 🔗 References
- Doc 2 §3.1 (DDD layers), §6.2 (response envelope), §6.5 (pagination)
- Doc 3 Part C → Users endpoints, Part D → users RLS policies
