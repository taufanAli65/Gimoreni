# 🏆 Phase 5 — Quests & Redemptions

**Goal**: Implement the full quest lifecycle: Admin creates/publishes quests → User views and submits proof → Admin approves/rejects → Points are awarded. This is the core gamification loop.

**Status**: 🔲 Not Started
**Depends on**: Phase 4

---

## Scope

Backend `quests` domain + `redemptions` domain (all 5 layers each) + frontend quest widget on User Home and full Quest Management for Admin. Includes proof image upload via Supabase Storage.

---

## 📁 Backend — Quests Domain (`api/src/domains/quests/`)

| File | Responsibility |
|---|---|
| `quests.router.ts` | CRUD routes + `/publish` shortcut + `/active` for User |
| `quests.controller.ts` | HTTP layer |
| `quests.service.ts` | Status transition logic (DRAFT → ACTIVE → COMPLETED/EXPIRED) |
| `quests.repository.ts` | Prisma queries; User sees only ACTIVE quests |
| `quests.dto.ts` | Zod: `CreateQuestDto`, `UpdateQuestDto` |

## 📁 Backend — Redemptions Domain (`api/src/domains/redemptions/`)

| File | Responsibility |
|---|---|
| `redemptions.router.ts` | `/redemptions` routes |
| `redemptions.controller.ts` | HTTP layer (multipart/form-data for proof) |
| `redemptions.service.ts` | Approve side effects: update points, set Quest to COMPLETED, create Notification |
| `redemptions.repository.ts` | Prisma queries + unique constraint guard |
| `redemptions.dto.ts` | Zod: `CreateRedemptionDto`, `RejectRedemptionDto` |

**Approve side effects (all in one DB transaction):**
1. `QuestRedemption.status = APPROVED`, `confirmedAt = now()`, `confirmedById = adminId`
2. `QuestRedemption.pointsAwarded = Quest.pointReward`
3. `User.totalPoints += Quest.pointReward`
4. `Quest.status = COMPLETED` (if this was the only/last pending redemption)
5. Create `Notification` for the User

---

## 📁 Frontend — Quests Domain (`app/src/domains/quests/`)

| File | Responsibility |
|---|---|
| `hooks/useQuests.ts` | List quests (role-filtered) |
| `hooks/useQuestMutations.ts` | Admin: create / update / delete / publish |
| `hooks/useActiveQuest.ts` | User: fetch active quest |
| `hooks/useRedemptionMutations.ts` | User: submit; Admin: approve/reject |
| `types.ts` | `Quest`, `QuestStatus`, `QuestRedemption`, `RedemptionStatus` interfaces |
| `components/QuestCard.tsx` | Card showing title, points, deadline, status badge |
| `components/QuestForm.tsx` | Admin create/edit form |
| `components/RedemptionForm.tsx` | User proof submission form (with image upload) |
| `components/RedemptionReviewCard.tsx` | Admin: displays proof + approve/reject buttons |

**Pages:**
- `app/src/pages/admin/QuestsPage.tsx` — full quest + redemption management
- Quest widget embedded in `app/src/pages/user/HomePage.tsx`

---

## 🔑 API Endpoints

### Quests
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/quests` | Authenticated | ADMIN: all; USER: ACTIVE only |
| `GET` | `/api/v1/quests/:id` | Authenticated | Single quest |
| `POST` | `/api/v1/quests` | ADMIN | Create (starts as DRAFT) |
| `PATCH` | `/api/v1/quests/:id` | ADMIN | Update quest fields |
| `DELETE` | `/api/v1/quests/:id` | ADMIN | Delete quest |
| `PATCH` | `/api/v1/quests/:id/publish` | ADMIN | `status → ACTIVE` |
| `GET` | `/api/v1/quests/active` | USER | Get current active quest for caller |

### Redemptions
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/redemptions` | ADMIN | All redemptions, filter `?status=` |
| `GET` | `/api/v1/redemptions/:id` | Authenticated | Own only for USER |
| `POST` | `/api/v1/redemptions` | USER | Submit proof; unique per quest per user |
| `PATCH` | `/api/v1/redemptions/:id/approve` | ADMIN | Trigger all approve side effects |
| `PATCH` | `/api/v1/redemptions/:id/reject` | ADMIN | Set status REJECTED + rejectionNote |

---

## ✅ Acceptance Criteria

- [ ] A quest starts as `DRAFT`; it is invisible to Users until Admin publishes it
- [ ] USER cannot submit more than one redemption per quest (`409 Conflict`)
- [ ] Proof image is compressed (≤ 500 KB) client-side before upload to `redemption-proofs` bucket
- [ ] Approving a redemption atomically awards points and creates a Notification
- [ ] Rejecting a redemption stores the `rejectionNote`
- [ ] `GET /quests` as USER never returns DRAFT or EXPIRED quests
- [ ] Quest widget on User Home shows active quest with point reward and deadline
- [ ] Admin Quests page lists all quests with status indicators and pending redemption count

---

## 🔗 References
- Doc 1 §4.4 (Quest System), §4.5 (Points System), §7 (Image Policy)
- Doc 3 Part C → Quests + Redemptions endpoints, Part D → quests/redemptions RLS
- Doc 3 Part E → `redemption-proofs` storage bucket + RLS
