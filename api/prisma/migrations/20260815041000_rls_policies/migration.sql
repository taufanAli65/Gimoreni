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
