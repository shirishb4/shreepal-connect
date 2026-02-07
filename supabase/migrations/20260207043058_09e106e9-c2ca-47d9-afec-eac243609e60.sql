
-- Add is_approved column to user_roles (default false for committee_member, true for member)
ALTER TABLE public.user_roles
ADD COLUMN is_approved boolean NOT NULL DEFAULT false;

-- Auto-approve all existing 'member' roles and leave committee_member as unapproved
UPDATE public.user_roles SET is_approved = true WHERE role = 'member';

-- Update handle_new_user trigger to auto-approve 'member' role only
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, member_name, contact_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'member_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'contact_number', '')
  );
  
  INSERT INTO public.user_roles (user_id, role, is_approved)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'member'),
    -- Auto-approve members, committee_member requires manual approval
    CASE 
      WHEN COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'member') = 'member' THEN true
      ELSE false
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update has_role function to check is_approved
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_approved = true
  )
$$;
