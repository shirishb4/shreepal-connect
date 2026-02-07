
-- Step 1: Create occupancy_status enum
CREATE TYPE public.occupancy_status AS ENUM ('self_occupied', 'rented', 'leased');

-- Step 2: Add occupancy_status column to units table
ALTER TABLE public.units
ADD COLUMN occupancy_status public.occupancy_status NOT NULL DEFAULT 'self_occupied';

-- Step 3: Create vehicle_type enum
CREATE TYPE public.vehicle_type AS ENUM ('two_wheeler', 'four_wheeler');

-- Step 4: Create parking_vehicles table
CREATE TABLE public.parking_vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vehicle_type public.vehicle_type NOT NULL,
  vehicle_number TEXT NOT NULL,
  vehicle_make TEXT,
  vehicle_model TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 5: Enable RLS on parking_vehicles
ALTER TABLE public.parking_vehicles ENABLE ROW LEVEL SECURITY;

-- Step 6: RLS policies for parking_vehicles
CREATE POLICY "Users can view own vehicles"
ON public.parking_vehicles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles"
ON public.parking_vehicles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles"
ON public.parking_vehicles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles"
ON public.parking_vehicles FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Committee members can view all vehicles"
ON public.parking_vehicles FOR SELECT
USING (has_role(auth.uid(), 'committee_member'::app_role));

-- Step 7: Trigger for updated_at on parking_vehicles
CREATE TRIGGER update_parking_vehicles_updated_at
BEFORE UPDATE ON public.parking_vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Step 8: Update handle_new_user trigger to include occupancy_status
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
      INSERT INTO public.units (user_id, unit_type, unit_number, wing, floor, occupancy_status)
      VALUES (
        NEW.id,
        (_unit->>'unit_type')::public.unit_type,
        _unit->>'unit_number',
        NULLIF(_unit->>'wing', ''),
        NULLIF(_unit->>'floor', ''),
        COALESCE((_unit->>'occupancy_status')::public.occupancy_status, 'self_occupied')
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;
