# 🗄️ Document 3: API Specification & ERD
## Gimoreni — *Gimme More Money*

---

## Part A: Entity Relationship Diagram (Prisma Schema)

```prisma
// api/prisma/schema.prisma
// Generated for: Gimoreni (Gimme More Money)

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ============================================================
// ENUMS
// ============================================================

enum Role {
  ADMIN
  USER
}

enum CategoryVisibility {
  ALL
  ADMIN_ONLY
  USER_ONLY
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum QuestStatus {
  DRAFT      // Admin created, not yet published
  ACTIVE     // Available for User to accept
  COMPLETED  // User has been confirmed & rewarded
  EXPIRED    // Deadline passed without completion
}

enum RedemptionStatus {
  PENDING    // User submitted, awaiting Admin review
  APPROVED   // Admin confirmed, points awarded
  REJECTED   // Admin rejected the submission
}

enum BonusType {
  MONTHLY_COMPLETION  // Perfect month (all days logged)
  STREAK_MILESTONE    // Hit a streak threshold
  MANUAL              // Admin-issued manual bonus
}

// ============================================================
// MODELS
// ============================================================

model User {
  id                   String    @id @default(cuid())
  supabaseUserId       String    @unique @map("supabase_user_id")
  email                String    @unique
  name                 String
  avatarUrl            String?   @map("avatar_url")
  role                 Role      @default(USER)
  totalPoints          Int       @default(0) @map("total_points")
  currentStreak        Int       @default(0) @map("current_streak")
  longestStreak        Int       @default(0) @map("longest_streak")
  lastLoggedDate       DateTime? @map("last_logged_date")
  hasCompletedTutorial Boolean   @default(false) @map("has_completed_tutorial")
  allowance            Decimal   @default(0) @db.Decimal(12, 2)
  balance              Decimal   @default(0) @db.Decimal(12, 2)
  isActive             Boolean   @default(true) @map("is_active")
  createdAt            DateTime  @default(now()) @map("created_at")
  updatedAt            DateTime  @updatedAt @map("updated_at")

  // Relations
  transactions         Transaction[]
  questRedemptions     QuestRedemption[]
  bonuses              Bonus[]
  createdCategories    Category[]       @relation("CategoryCreator")
  createdQuests        Quest[]          @relation("QuestCreator")
  confirmedRedemptions QuestRedemption[] @relation("RedemptionConfirmer")

  @@map("users")
}

model Category {
  id          String             @id @default(cuid())
  name        String
  icon        String?            // Emoji or icon name (e.g., "🍔", "shopping-cart")
  color       String?            // Hex color for chart display (e.g., "#52B788")
  visibility  CategoryVisibility @default(ALL)
  isActive    Boolean            @default(true) @map("is_active")
  createdById String             @map("created_by_id")
  createdAt   DateTime           @default(now()) @map("created_at")
  updatedAt   DateTime           @updatedAt @map("updated_at")

  // Relations
  createdBy    User          @relation("CategoryCreator", fields: [createdById], references: [id])
  transactions Transaction[]

  @@map("categories")
}

model Transaction {
  id          String          @id @default(cuid())
  userId      String          @map("user_id")
  categoryId  String          @map("category_id")
  type        TransactionType
  amount      Decimal         @db.Decimal(12, 2)
  description String?
  date        DateTime        @db.Date        // The date this transaction is logged for
  receiptUrl  String?         @map("receipt_url") // Optional image receipt (Supabase Storage)
  createdAt   DateTime        @default(now()) @map("created_at")
  updatedAt   DateTime        @updatedAt @map("updated_at")

  // Relations
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category    Category @relation(fields: [categoryId], references: [id])

  @@index([userId, date])
  @@map("transactions")
}

model Quest {
  id            String      @id @default(cuid())
  title         String
  description   String
  pointReward   Int         @map("point_reward")
  status        QuestStatus @default(DRAFT)
  proofRequired Boolean     @default(true) @map("proof_required")
  deadline      DateTime?
  createdById   String      @map("created_by_id")
  createdAt     DateTime    @default(now()) @map("created_at")
  updatedAt     DateTime    @updatedAt @map("updated_at")

  // Relations
  createdBy    User              @relation("QuestCreator", fields: [createdById], references: [id])
  redemptions  QuestRedemption[]

  @@map("quests")
}

model QuestRedemption {
  id           String           @id @default(cuid())
  questId      String           @map("quest_id")
  userId       String           @map("user_id")  // The User submitting the redemption
  proofUrl     String?          @map("proof_url") // Supabase Storage URL (compressed image)
  proofNote    String?          @map("proof_note")
  status       RedemptionStatus @default(PENDING)
  confirmedById String?         @map("confirmed_by_id") // Admin who acted on this
  confirmedAt  DateTime?        @map("confirmed_at")
  rejectionNote String?         @map("rejection_note")
  pointsAwarded Int?            @map("points_awarded") // Snapshot of points at time of award
  createdAt    DateTime         @default(now()) @map("created_at")
  updatedAt    DateTime         @updatedAt @map("updated_at")

  // Relations
  quest        Quest @relation(fields: [questId], references: [id], onDelete: Cascade)
  user         User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  confirmedBy  User? @relation("RedemptionConfirmer", fields: [confirmedById], references: [id])

  @@unique([questId, userId]) // A user can only submit one redemption per quest
  @@index([userId, status])
  @@map("quest_redemptions")
}

model Bonus {
  id          String    @id @default(cuid())
  userId      String    @map("user_id")
  type        BonusType
  amount      Decimal   @db.Decimal(12, 2)  // Monetary bonus added to balance
  pointsBonus Int       @default(0) @map("points_bonus")
  description String?
  month       Int?      // For MONTHLY_COMPLETION bonuses (1–12)
  year        Int?      // For MONTHLY_COMPLETION bonuses
  isApplied   Boolean   @default(false) @map("is_applied") // Has this been added to user.balance?
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  // Relations
  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("bonuses")
}

model StreakLog {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  date      DateTime @db.Date
  didLog    Boolean  @default(false) @map("did_log") // true if user logged at least one transaction
  createdAt DateTime @default(now()) @map("created_at")

  @@unique([userId, date])
  @@map("streak_logs")
}

model Notification {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  title       String
  body        String
  isRead      Boolean  @default(false) @map("is_read")
  actionUrl   String?  @map("action_url") // Optional deep link
  requiresAction Boolean @default(false) @map("requires_action") // Triggers interactive component
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([userId, isRead])
  @@map("notifications")
}
```

---

## Part B: ERD Relationship Summary

```
User ─────────────────────────────────────────────────────────────┐
 │  1                                                              │
 │  ├── has many ──► Transaction        (user_id FK)              │
 │  ├── has many ──► QuestRedemption    (user_id FK)              │
 │  ├── has many ──► Bonus              (user_id FK)              │
 │  ├── has many ──► StreakLog          (user_id FK)              │
 │  ├── has many ──► Notification       (user_id FK)              │
 │  ├── created  ──► Category           (created_by_id FK)        │
 │  ├── created  ──► Quest              (created_by_id FK)        │
 │  └── confirmed──► QuestRedemption    (confirmed_by_id FK)      │
 │                                                                 │
Category ────────────────────────────────────────────────────────┐│
 │  1                                                             ││
 └── has many ──► Transaction           (category_id FK)         ││
                                                                  ││
Quest ───────────────────────────────────────────────────────────┤│
 │  1                                                             ││
 └── has many ──► QuestRedemption       (quest_id FK)            ││
                                                                  ││
QuestRedemption ─────────────────────────────────────────────────┘│
  belongs to ──► Quest, User (submitter), User (confirmer, nullable)
```

---

## Part C: API Endpoint Specification

> **Base:** `/api/v1` | **Auth:** `Bearer <JWT>` | **Rate Limit:** All endpoints | **Pagination:** All list endpoints via `?page=&limit=`

---

### 🔐 Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Login with email + password. Returns access token + sets refresh cookie. |
| `POST` | `/auth/refresh` | Public | Use refresh cookie to get new access token. |
| `POST` | `/auth/logout` | Authenticated | Clears refresh cookie. |
| `GET`  | `/auth/me` | Authenticated | Returns current user profile. |

**`POST /auth/login` — Request Body:**
```json
{
  "email": "user@example.com",
  "password": "s3cur3P@ss"
}
```

**`POST /auth/login` — Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "user": {
      "id": "clx...",
      "name": "Sibling Name",
      "role": "USER",
      "hasCompletedTutorial": false
    }
  }
}
```

---

### 👥 Users *(Admin Only)*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users` | ADMIN | List all users (paginated). |
| `GET` | `/users/:id` | ADMIN | Get a single user's profile & stats. |
| `POST` | `/users` | ADMIN | Create a new user account. |
| `PATCH` | `/users/:id` | ADMIN | Update user info (name, role, allowance, balance). |
| `DELETE` | `/users/:id` | ADMIN | Soft-delete (set `isActive: false`). |
| `PATCH` | `/users/me` | Authenticated | User updates their own profile (`name`, `avatarUrl`, `hasCompletedTutorial`). |
| `PATCH` | `/users/:id/balance` | ADMIN | Adjust a user's balance or allowance directly. |

---

### 📁 Categories *(Both Roles)*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/categories` | Authenticated | List categories filtered by role visibility. |
| `GET` | `/categories/:id` | Authenticated | Get a single category (visibility-gated). |
| `POST` | `/categories` | Authenticated | Create a new category. |
| `PATCH` | `/categories/:id` | Authenticated | Update a category (Admin can set visibility). |
| `DELETE` | `/categories/:id` | ADMIN | Delete a category (soft delete or hard delete). |

**Visibility Logic (Server-Side):**
```
GET /categories:
  - ADMIN sees: ALL + ADMIN_ONLY + USER_ONLY
  - USER sees:  ALL + USER_ONLY
```

---

### 💸 Transactions (Daily Financial Records) *(Both Roles)*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/transactions` | Authenticated | List own transactions. Admin can filter by `?userId=` |
| `GET` | `/transactions/:id` | Authenticated | Get a single transaction (ownership enforced for User). |
| `POST` | `/transactions` | Authenticated | Create a new transaction for a given `date`. |
| `PATCH` | `/transactions/:id` | Authenticated | Update a transaction (own only for USER). |
| `DELETE` | `/transactions/:id` | Authenticated | Delete a transaction (own only for USER). |
| `GET` | `/transactions/summary` | ADMIN | Aggregated summary per user per month (for dashboard). |
| `GET` | `/transactions/calendar` | ADMIN | Returns daily transaction presence for calendar view. |

**`POST /transactions` — Request Body:**
```json
{
  "categoryId": "clx...",
  "type": "EXPENSE",
  "amount": 25000,
  "description": "Lunch at school",
  "date": "2026-08-14",
  "receiptUrl": null
}
```

**Query Params for `GET /transactions`:**
```
?userId=<id>         (Admin only, filter by user)
?startDate=YYYY-MM-DD
?endDate=YYYY-MM-DD
?type=INCOME|EXPENSE
?categoryId=<id>
?page=1&limit=20
```

---

### 🏆 Quests *(Admin CRUD, User Read)*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/quests` | Authenticated | List quests. USER sees only `ACTIVE`. ADMIN sees all. |
| `GET` | `/quests/:id` | Authenticated | Get a single quest. |
| `POST` | `/quests` | ADMIN | Create a new quest. |
| `PATCH` | `/quests/:id` | ADMIN | Update quest (title, description, status, deadline). |
| `DELETE` | `/quests/:id` | ADMIN | Delete a quest. |
| `PATCH` | `/quests/:id/publish` | ADMIN | Shortcut to set status → `ACTIVE`. |
| `GET` | `/quests/active` | USER | Get the currently active quest for the calling User. |

---

### 🎟️ Quest Redemptions *(User submits, Admin confirms)*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/redemptions` | ADMIN | List all redemptions (paginated). Filter by `?status=`. |
| `GET` | `/redemptions/:id` | Authenticated | Get a redemption (User can only see own). |
| `POST` | `/redemptions` | USER | Submit a quest redemption with proof. |
| `PATCH` | `/redemptions/:id/approve` | ADMIN | Approve redemption → award points to User. |
| `PATCH` | `/redemptions/:id/reject` | ADMIN | Reject redemption with a `rejectionNote`. |

**`POST /redemptions` — Request Body (multipart/form-data):**
```
questId:   "clx..."
proofUrl:  <uploaded Supabase Storage URL — client compresses before upload>
proofNote: "I completed the task, see attached screenshot."
```

**`PATCH /redemptions/:id/approve` — Side Effects (server-side):**
1. Set `QuestRedemption.status = APPROVED`.
2. Set `QuestRedemption.confirmedAt = now()`, `confirmedById = adminId`.
3. Set `QuestRedemption.pointsAwarded = Quest.pointReward`.
4. Increment `User.totalPoints += Quest.pointReward`.
5. Create a `Notification` for the User: "Your quest has been approved! +X pts".

---

### 🎁 Bonuses *(Admin Only)*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/bonuses` | ADMIN | List all bonuses. Filter by `?userId=&type=`. |
| `GET` | `/bonuses/:id` | ADMIN | Get a single bonus record. |
| `POST` | `/bonuses` | ADMIN | Create and (optionally) apply a bonus to a User's balance. |
| `PATCH` | `/bonuses/:id` | ADMIN | Update bonus details before it is applied. |
| `DELETE` | `/bonuses/:id` | ADMIN | Delete a bonus (only if not yet applied). |
| `POST` | `/bonuses/:id/apply` | ADMIN | Apply the bonus amount to `User.balance`. |

---

### 🔥 Streaks

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/streaks/me` | USER | Get the calling user's streak data. |
| `GET` | `/streaks/:userId` | ADMIN | Get streak data for any user. |
| `POST` | `/streaks/check` | System/CRON | Trigger daily streak evaluation (called by a CRON job). Updates `StreakLog`, increments/resets streaks. |
| `POST` | `/streaks/remind` | System/CRON | Send in-app notifications to users who haven't logged today. |

**Streak Logic (called by `/streaks/check`):**
1. For each active User, query `StreakLog` for today's date.
2. If `didLog = true` (at least one `Transaction` exists for today): increment `currentStreak`, update `longestStreak` if needed.
3. If `didLog = false` and it's past 23:00 local time: reset `currentStreak = 0`.
4. Record the `StreakLog` entry for the day.

---

### 🔔 Notifications

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/notifications` | Authenticated | List own notifications (unread first). |
| `PATCH` | `/notifications/:id/read` | Authenticated | Mark a notification as read. |
| `PATCH` | `/notifications/read-all` | Authenticated | Mark all own notifications as read. |
| `DELETE` | `/notifications/:id` | Authenticated | Delete a notification. |

---

## Part D: Supabase Row Level Security (RLS) — SQL

> [!IMPORTANT]
> These policies enforce data access at the **database layer** as a second line of defense, complementing the Express middleware guards. They use the `auth.uid()` function (Supabase's authenticated user ID) and a custom `get_my_role()` helper function.

```sql
-- ============================================================
-- HELPER FUNCTION: get_my_role()
-- Returns the role of the currently authenticated Supabase user.
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users
  WHERE supabase_user_id = auth.uid()::text
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- ============================================================
-- TABLE: users
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Admin can read all users.
CREATE POLICY "admin_read_all_users"
  ON public.users FOR SELECT
  USING (public.get_my_role() = 'ADMIN');

-- Users can only read their own row.
CREATE POLICY "user_read_own_profile"
  ON public.users FOR SELECT
  USING (supabase_user_id = auth.uid()::text);

-- Admin can insert new users.
CREATE POLICY "admin_insert_users"
  ON public.users FOR INSERT
  WITH CHECK (public.get_my_role() = 'ADMIN');

-- Admin can update any user. Users can update only their own row.
CREATE POLICY "admin_update_any_user"
  ON public.users FOR UPDATE
  USING (public.get_my_role() = 'ADMIN');

CREATE POLICY "user_update_own_profile"
  ON public.users FOR UPDATE
  USING (supabase_user_id = auth.uid()::text);

-- Only Admin can delete users.
CREATE POLICY "admin_delete_users"
  ON public.users FOR DELETE
  USING (public.get_my_role() = 'ADMIN');


-- ============================================================
-- TABLE: categories
-- ============================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Admin can see all categories regardless of visibility.
CREATE POLICY "admin_read_all_categories"
  ON public.categories FOR SELECT
  USING (public.get_my_role() = 'ADMIN');

-- Users can see categories visible to ALL or USER_ONLY.
CREATE POLICY "user_read_visible_categories"
  ON public.categories FOR SELECT
  USING (
    public.get_my_role() = 'USER'
    AND visibility IN ('ALL', 'USER_ONLY')
  );

-- Both roles can create categories.
CREATE POLICY "authenticated_insert_categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Creator or Admin can update.
CREATE POLICY "admin_update_any_category"
  ON public.categories FOR UPDATE
  USING (public.get_my_role() = 'ADMIN');

CREATE POLICY "user_update_own_category"
  ON public.categories FOR UPDATE
  USING (
    public.get_my_role() = 'USER'
    AND created_by_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );

-- Only Admin can delete categories.
CREATE POLICY "admin_delete_categories"
  ON public.categories FOR DELETE
  USING (public.get_my_role() = 'ADMIN');


-- ============================================================
-- TABLE: transactions
-- ============================================================

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Admin can read all transactions.
CREATE POLICY "admin_read_all_transactions"
  ON public.transactions FOR SELECT
  USING (public.get_my_role() = 'ADMIN');

-- Users can only read their own transactions.
CREATE POLICY "user_read_own_transactions"
  ON public.transactions FOR SELECT
  USING (
    user_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );

-- Both roles can create transactions for themselves.
CREATE POLICY "user_insert_own_transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (
    user_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );

-- Both roles can update their own transactions. Admin can update any.
CREATE POLICY "admin_update_any_transaction"
  ON public.transactions FOR UPDATE
  USING (public.get_my_role() = 'ADMIN');

CREATE POLICY "user_update_own_transaction"
  ON public.transactions FOR UPDATE
  USING (
    user_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );

-- Both roles can delete their own transactions. Admin can delete any.
CREATE POLICY "admin_delete_any_transaction"
  ON public.transactions FOR DELETE
  USING (public.get_my_role() = 'ADMIN');

CREATE POLICY "user_delete_own_transaction"
  ON public.transactions FOR DELETE
  USING (
    user_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );


-- ============================================================
-- TABLE: quests
-- ============================================================

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

-- Admin can read all quests (including DRAFT, EXPIRED).
CREATE POLICY "admin_read_all_quests"
  ON public.quests FOR SELECT
  USING (public.get_my_role() = 'ADMIN');

-- Users can only read ACTIVE quests.
CREATE POLICY "user_read_active_quests"
  ON public.quests FOR SELECT
  USING (
    public.get_my_role() = 'USER'
    AND status = 'ACTIVE'
  );

-- Only Admin can create, update, delete quests.
CREATE POLICY "admin_insert_quests"
  ON public.quests FOR INSERT
  WITH CHECK (public.get_my_role() = 'ADMIN');

CREATE POLICY "admin_update_quests"
  ON public.quests FOR UPDATE
  USING (public.get_my_role() = 'ADMIN');

CREATE POLICY "admin_delete_quests"
  ON public.quests FOR DELETE
  USING (public.get_my_role() = 'ADMIN');


-- ============================================================
-- TABLE: quest_redemptions
-- ============================================================

ALTER TABLE public.quest_redemptions ENABLE ROW LEVEL SECURITY;

-- Admin can read all redemptions.
CREATE POLICY "admin_read_all_redemptions"
  ON public.quest_redemptions FOR SELECT
  USING (public.get_my_role() = 'ADMIN');

-- Users can read only their own redemptions.
CREATE POLICY "user_read_own_redemptions"
  ON public.quest_redemptions FOR SELECT
  USING (
    user_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );

-- Only Users can submit (insert) their own redemptions.
CREATE POLICY "user_insert_own_redemption"
  ON public.quest_redemptions FOR INSERT
  WITH CHECK (
    public.get_my_role() = 'USER'
    AND user_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );

-- Only Admin can update redemptions (approve/reject).
CREATE POLICY "admin_update_redemptions"
  ON public.quest_redemptions FOR UPDATE
  USING (public.get_my_role() = 'ADMIN');

-- Only Admin can delete redemptions.
CREATE POLICY "admin_delete_redemptions"
  ON public.quest_redemptions FOR DELETE
  USING (public.get_my_role() = 'ADMIN');


-- ============================================================
-- TABLE: bonuses
-- ============================================================

ALTER TABLE public.bonuses ENABLE ROW LEVEL SECURITY;

-- Only Admin can fully manage bonuses.
CREATE POLICY "admin_full_access_bonuses"
  ON public.bonuses FOR ALL
  USING (public.get_my_role() = 'ADMIN')
  WITH CHECK (public.get_my_role() = 'ADMIN');

-- Users can read their own bonuses (for transparency in their wallet).
CREATE POLICY "user_read_own_bonuses"
  ON public.bonuses FOR SELECT
  USING (
    user_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );


-- ============================================================
-- TABLE: streak_logs
-- ============================================================

ALTER TABLE public.streak_logs ENABLE ROW LEVEL SECURITY;

-- Admin can read all streak logs.
CREATE POLICY "admin_read_all_streak_logs"
  ON public.streak_logs FOR SELECT
  USING (public.get_my_role() = 'ADMIN');

-- Users can read only their own streak logs.
CREATE POLICY "user_read_own_streak_logs"
  ON public.streak_logs FOR SELECT
  USING (
    user_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );

-- Streak logs are written by the system (service role), not by users directly.
-- No INSERT/UPDATE/DELETE policies for authenticated users — use service_role key in CRON.


-- ============================================================
-- TABLE: notifications
-- ============================================================

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Admin can read all notifications.
CREATE POLICY "admin_read_all_notifications"
  ON public.notifications FOR SELECT
  USING (public.get_my_role() = 'ADMIN');

-- Users can read only their own notifications.
CREATE POLICY "user_read_own_notifications"
  ON public.notifications FOR SELECT
  USING (
    user_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );

-- Users can update (mark as read) their own notifications.
CREATE POLICY "user_update_own_notifications"
  ON public.notifications FOR UPDATE
  USING (
    user_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );

-- Users can delete their own notifications.
CREATE POLICY "user_delete_own_notifications"
  ON public.notifications FOR DELETE
  USING (
    user_id = (
      SELECT id FROM public.users WHERE supabase_user_id = auth.uid()::text
    )
  );

-- Notifications are inserted by the system (backend service_role).
-- No INSERT policy for authenticated anon users.
```

---

## Part E: Supabase Storage Buckets

```sql
-- Run in Supabase Storage settings or via SQL editor

-- Bucket for Quest Redemption proof images
INSERT INTO storage.buckets (id, name, public)
VALUES ('redemption-proofs', 'redemption-proofs', false);

-- Bucket for User avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-avatars', 'user-avatars', true);

-- RLS: Only the owning user can upload to their own redemption-proof folder
CREATE POLICY "user_upload_own_proof"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'redemption-proofs'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- RLS: Admins can read all proofs; Users can read their own
CREATE POLICY "admin_read_all_proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'redemption-proofs'
    AND public.get_my_role() = 'ADMIN'
  );

CREATE POLICY "user_read_own_proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'redemption-proofs'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- RLS: Anyone authenticated can upload their own avatar
CREATE POLICY "user_upload_own_avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---
