
-- Repopulate data for existing auth users whose data was lost when tables were flushed
-- This migration re-runs the handle_new_user logic for all existing auth users

DO $$
DECLARE
  u RECORD;
  _units jsonb;
  _unit jsonb;
BEGIN
  FOR u IN SELECT id, raw_user_meta_data FROM auth.users
  LOOP
    -- Insert profile if not exists
    INSERT INTO public.profiles (id, member_name, contact_number)
    VALUES (
      u.id,
      COALESCE(u.raw_user_meta_data->>'member_name', ''),
      COALESCE(u.raw_user_meta_data->>'contact_number', '')
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert role if not exists
    INSERT INTO public.user_roles (user_id, role, is_approved)
    VALUES (
      u.id,
      COALESCE((u.raw_user_meta_data->>'role')::public.app_role, 'member'),
      CASE 
        WHEN COALESCE((u.raw_user_meta_data->>'role')::public.app_role, 'member') = 'member' THEN true
        ELSE false
      END
    );

    -- Insert units from metadata
    _units := u.raw_user_meta_data->'units';
    IF _units IS NOT NULL AND jsonb_typeof(_units) = 'array' THEN
      FOR _unit IN SELECT * FROM jsonb_array_elements(_units)
      LOOP
        INSERT INTO public.units (user_id, unit_type, unit_number, wing, floor, occupancy_status)
        VALUES (
          u.id,
          (_unit->>'unit_type')::public.unit_type,
          _unit->>'unit_number',
          NULLIF(_unit->>'wing', ''),
          NULLIF(_unit->>'floor', ''),
          COALESCE((_unit->>'occupancy_status')::public.occupancy_status, 'self_occupied')
        );
      END LOOP;
    END IF;
  END LOOP;
END;
$$;

-- Recreate the trigger to ensure it's properly attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
