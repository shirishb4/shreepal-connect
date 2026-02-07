
-- Fix profiles SELECT policies: make them PERMISSIVE instead of RESTRICTIVE
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Committee members can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Committee members can view all profiles"
  ON public.profiles FOR SELECT
  USING (has_role(auth.uid(), 'committee_member'::app_role));

-- Fix units SELECT policies: make them PERMISSIVE instead of RESTRICTIVE
DROP POLICY IF EXISTS "Users can view own units" ON public.units;
DROP POLICY IF EXISTS "Committee members can view all units" ON public.units;

CREATE POLICY "Users can view own units"
  ON public.units FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Committee members can view all units"
  ON public.units FOR SELECT
  USING (has_role(auth.uid(), 'committee_member'::app_role));

-- Fix user_roles SELECT policies: make them PERMISSIVE instead of RESTRICTIVE
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Committee members can view all roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Committee members can view all roles"
  ON public.user_roles FOR SELECT
  USING (has_role(auth.uid(), 'committee_member'::app_role));

-- Also fix INSERT/UPDATE/DELETE policies that may be restrictive
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own units" ON public.units;
CREATE POLICY "Users can insert own units"
  ON public.units FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own units" ON public.units;
CREATE POLICY "Users can update own units"
  ON public.units FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own units" ON public.units;
CREATE POLICY "Users can delete own units"
  ON public.units FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own role on signup" ON public.user_roles;
CREATE POLICY "Users can insert own role on signup"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Committee members can update roles" ON public.user_roles;
CREATE POLICY "Committee members can update roles"
  ON public.user_roles FOR UPDATE
  USING (has_role(auth.uid(), 'committee_member'::app_role))
  WITH CHECK (has_role(auth.uid(), 'committee_member'::app_role));
