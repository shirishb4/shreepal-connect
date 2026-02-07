
-- Backfill existing users who don't have profiles yet
INSERT INTO public.profiles (id, member_name, contact_number)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'member_name', ''),
  COALESCE(u.raw_user_meta_data->>'contact_number', '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- Backfill existing users who don't have roles yet
INSERT INTO public.user_roles (user_id, role, is_approved)
SELECT 
  u.id,
  COALESCE((u.raw_user_meta_data->>'role')::public.app_role, 'member'),
  CASE 
    WHEN COALESCE((u.raw_user_meta_data->>'role')::public.app_role, 'member') = 'member' THEN true
    ELSE false
  END
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE ur.user_id IS NULL;
