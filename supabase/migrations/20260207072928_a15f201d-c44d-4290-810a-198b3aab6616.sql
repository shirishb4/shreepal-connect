
-- Step 1: Clear all public tables (order matters for potential dependencies)
DELETE FROM public.units;
DELETE FROM public.user_roles;
DELETE FROM public.profiles;

-- Step 2: Delete all auth users so they can re-register
DELETE FROM auth.users;

-- Step 3: Update handle_new_user trigger to also insert units from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _units jsonb;
  _unit jsonb;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, member_name, contact_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'member_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'contact_number', '')
  );
  
  -- Insert role
  INSERT INTO public.user_roles (user_id, role, is_approved)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'member'),
    CASE 
      WHEN COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'member') = 'member' THEN true
      ELSE false
    END
  );

  -- Insert units from metadata if provided
  _units := NEW.raw_user_meta_data->'units';
  IF _units IS NOT NULL AND jsonb_typeof(_units) = 'array' THEN
    FOR _unit IN SELECT * FROM jsonb_array_elements(_units)
    LOOP
      INSERT INTO public.units (user_id, unit_type, unit_number, wing, floor)
      VALUES (
        NEW.id,
        (_unit->>'unit_type')::public.unit_type,
        _unit->>'unit_number',
        NULLIF(_unit->>'wing', ''),
        NULLIF(_unit->>'floor', '')
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;
