# 📁 Phase 3 — Category Management

**Goal**: Implement category CRUD with role-based visibility filtering (ALL / ADMIN_ONLY / USER_ONLY), on both backend and frontend.

**Status**: ✅ Done
**Depends on**: Phase 2

---

## Scope

Backend `categories` domain (all 5 layers) + frontend hooks and the Misc admin page category section. Both Admin and User can create categories, but only Admin can set visibility or delete.

---

## 📁 Backend Files (`api/src/domains/categories/`)

| File | Responsibility |
|---|---|
| `categories.router.ts` | `/categories` routes — role guards vary by method |
| `categories.controller.ts` | Parse params, call service, return envelope |
| `categories.service.ts` | Visibility filtering logic based on `req.user.role` |
| `categories.repository.ts` | Prisma queries — filtering by visibility enum |
| `categories.dto.ts` | Zod: `CreateCategoryDto`, `UpdateCategoryDto` |

**Visibility logic (service layer):**
```
ADMIN request → return categories where visibility IN ['ALL', 'ADMIN_ONLY', 'USER_ONLY']
USER request  → return categories where visibility IN ['ALL', 'USER_ONLY']
```

---

## 📁 Frontend Files (`app/src/domains/categories/`)

| File | Responsibility |
|---|---|
| `hooks/useCategories.ts` | `useQuery` for list (auto-filtered by role on server) |
| `hooks/useCategoryMutations.ts` | create / update / delete mutations |
| `types.ts` | `Category`, `CategoryVisibility` interfaces |
| `components/CategoryForm.tsx` | Reusable create/edit form (used in Misc page + Add page) |
| `components/CategoryBadge.tsx` | Visual pill showing category icon + color |

**Pages** (Misc page section, in `app/src/pages/admin/`):
- Category list table with inline edit/delete in `MiscPage.tsx`

---

## 🔑 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/categories` | Authenticated | Returns filtered list based on caller's role |
| `GET` | `/api/v1/categories/:id` | Authenticated | Single category (visibility-gated) |
| `POST` | `/api/v1/categories` | Authenticated | Create; User cannot set `ADMIN_ONLY` visibility |
| `PATCH` | `/api/v1/categories/:id` | Authenticated | Creator or Admin; only Admin can change visibility |
| `DELETE` | `/api/v1/categories/:id` | ADMIN | Hard or soft delete |

**Business rule**: A User attempting to set `visibility = 'ADMIN_ONLY'` must receive a `403`.

---

## ✅ Acceptance Criteria

- [ ] `GET /categories` as USER never returns categories with `visibility = 'ADMIN_ONLY'`
- [ ] `GET /categories` as ADMIN returns all categories regardless of visibility
- [ ] `POST /categories` as USER with `visibility: 'ADMIN_ONLY'` returns `403`
- [ ] `DELETE /categories/:id` as USER returns `403`
- [ ] RLS policies match the service-layer visibility logic
- [ ] Frontend category select in the Add Transaction form shows only role-visible categories
- [ ] Categories have icon (emoji) and color (hex) fields displayed in the UI

---

## 🔗 References
- Doc 1 §3 (Roles matrix)
- Doc 3 Part C → Categories endpoints, Part D → categories RLS policies
