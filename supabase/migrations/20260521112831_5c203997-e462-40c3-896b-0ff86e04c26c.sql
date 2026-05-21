
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  unit_record jsonb;
  signup_role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, member_name, contact_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'member_name', NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'contact_number', '')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert role (committee_member is unapproved until admin confirms)
  signup_role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'member'::app_role);
  INSERT INTO public.user_roles (user_id, role, is_approved)
  VALUES (
    NEW.id,
    signup_role,
    CASE WHEN signup_role = 'member'::app_role THEN true ELSE false END
  )
  ON CONFLICT DO NOTHING;

  -- Insert units from metadata
  IF NEW.raw_user_meta_data ? 'units' THEN
    FOR unit_record IN SELECT * FROM jsonb_array_elements(NEW.raw_user_meta_data->'units')
    LOOP
      INSERT INTO public.units (user_id, unit_type, unit_number, wing, floor, occupancy_status)
      VALUES (
        NEW.id,
        (unit_record->>'unit_type')::unit_type,
        unit_record->>'unit_number',
        NULLIF(unit_record->>'wing', ''),
        NULLIF(unit_record->>'floor', ''),
        COALESCE((unit_record->>'occupancy_status')::occupancy_status, 'self_occupied'::occupancy_status)
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

-- Ensure trigger is attached to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
